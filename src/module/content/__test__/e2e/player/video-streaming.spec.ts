import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'

import { CONTENT_TEST_FIXTURES } from '@contentModule/__test__/test.constant'
import { ContentModule } from '@contentModule/content.module'
import { CreateMovieUseCase } from '@contentModule/core/use-case/create-movie.use-case'
import { faker } from '@faker-js/faker'
import { Tables } from '@testInfra/enum/table.enum'
import { testDbClient } from '@testInfra/knex.database'
import { createNestApp } from '@testInfra/test-e2e.setup'
import fs from 'fs'
import nock, { cleanAll } from 'nock'
import request from 'supertest'

const fakeUserId = faker.string.uuid()
jest.mock('jsonwebtoken', () => ({
  verify: (_token: string, _secret: string, _options: any, callback: any) => {
    callback(null, { sub: fakeUserId })
  }
}))

describe('ContentController (e2e)', () => {
  let module: TestingModule
  let app: INestApplication
  let createMovieUseCase: CreateMovieUseCase

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([ContentModule])
    app = nestTestSetup.app
    module = nestTestSetup.module

    createMovieUseCase = module.get<CreateMovieUseCase>(CreateMovieUseCase)
  })

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await testDbClient(Tables.VideoMetadata).del()

    await testDbClient(Tables.Video).del()
    await testDbClient(Tables.Movie).del()
    await testDbClient(Tables.Content).del()
    cleanAll()
  })

  afterAll(async () => {
    module.close()
    fs.rmSync('./uploads', { recursive: true, force: true })
  })

  describe('GET /stream/:videoId', () => {
    it('streams a video', async () => {
      nock('https://api.themoviedb.org/3', {
        encodedQueryParams: true,
        reqheaders: {
          Authorization: (): boolean => true
        }
      })
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`/search/keyword`)
        .query({
          query: 'Test Video',
          page: '1'
        })
        .reply(200, {
          results: [
            {
              id: '1'
            }
          ]
        })

      nock('https://api.themoviedb.org/3', {
        encodedQueryParams: true,
        reqheaders: {
          Authorization: (): boolean => true
        }
      })
        .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
        .get(`discover/movie`)
        .query({
          with_keywords: '1'
        })
        .reply(200, {
          results: [
            {
              vote_average: 8.5
            }
          ]
        })

      nock('https://generativelanguage.googleapis.com')
        .post('/v1beta/models/gemini-2.0-flash:generateContent')
        .query(true) // Match any query parameters
        .reply(200, {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      responseText: 'This is a test video summary.'
                    })
                  }
                ]
              },
              finishReason: 'STOP',
              index: 0
            }
          ]
        })

      nock('https://generativelanguage.googleapis.com')
        .post('/v1beta/models/gemini-2.0-flash:generateContent')
        .query(true) // Match any query parameters
        .reply(200, {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      responseText: 'This is a test video transcript.'
                    })
                  }
                ]
              },
              finishReason: 'STOP',
              index: 0
            }
          ]
        })

      nock('https://generativelanguage.googleapis.com')
        .post('/v1beta/models/gemini-2.0-flash:generateContent')
        .query(true) // Match any query parameters
        .reply(200, {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      ageRating: 12,
                      explanation:
                        'The video contains mild language and thematic elements appropriate for viewers 12 and above.',
                      categories: ['language', 'thematic elements']
                    })
                  }
                ]
              },
              finishReason: 'STOP',
              index: 0
            }
          ]
        })
      const createdMovie = await createMovieUseCase.execute({
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: `${CONTENT_TEST_FIXTURES}/sample.mp4`,
        thumbnailUrl: `${CONTENT_TEST_FIXTURES}/sample.jpg`,
        sizeInKb: 1430145
      })

      const fileSize = 1430145
      const range = `bytes=0-${fileSize - 1}`

      const response = await request(app.getHttpServer())
        .get(`/stream/${createdMovie.movie.video.id}`)
        .set('Authorization', `Bearer fake-token`)
        .set('Range', range)
        .expect(HttpStatus.PARTIAL_CONTENT)

      expect(response.headers['content-range']).toBe(
        `bytes 0-${fileSize - 1}/${fileSize}`
      )
      expect(response.headers['accept-ranges']).toBe('bytes')
      expect(response.headers['content-length']).toBe(String(fileSize))
      expect(response.headers['content-type']).toBe('video/mp4')
    })
    it('returns 404 if the video is not found', async () => {
      await request(app.getHttpServer())
        .get('/stream/45705b56-a47f-4869-b736-8f6626c940f8')
        .set('Authorization', `Bearer fake-token`)
        .expect(HttpStatus.NOT_FOUND)
    })
  })
})
