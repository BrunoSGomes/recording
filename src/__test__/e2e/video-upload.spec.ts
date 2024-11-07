import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@src/app.module'
import { ContentRepository } from '@src/persistence/repository/content.repository'
import { MovieRepository } from '@src/persistence/repository/movie.repository'
import { VideoRepository } from '@src/persistence/repository/video.repository'
import fs from 'fs'
import request from 'supertest'
import nock from 'nock'

describe('VideoUploadController (e2e)', () => {
  let module: TestingModule
  let app: INestApplication
  let videoRepository: VideoRepository
  let contentRepository: ContentRepository
  let movieRepository: MovieRepository

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = module.createNestApplication()
    await app.init()

    videoRepository = module.get<VideoRepository>(VideoRepository)
    contentRepository = module.get<ContentRepository>(ContentRepository)
    movieRepository = module.get<MovieRepository>(MovieRepository)
  })

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await videoRepository.deleteAll()
    await movieRepository.deleteAll()
    await contentRepository.deleteAll()
    nock.cleanAll()
  })

  afterAll(async () => {
    module.close()
    fs.rmSync('./uploads', { recursive: true, force: true })
  })

  describe('/video (POST)', () => {
    it('uploads a video', async () => {
      //nock has support to native fetch only in 14.0.0-beta.6
      //https://github.com/nock/nock/issues/2397
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

      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
        thumbnailUrl: 'uploads/test.jpg',
        sizeInKb: 1430145,
        duration: 100
      }

      await request(app.getHttpServer())
        .post('/content/video')
        .attach('video', './test/fixtures/sample.mp4')
        .attach('thumbnail', './test/fixtures/sample.jpg')
        .field('title', video.title)
        .field('description', video.description)
        .expect(HttpStatus.CREATED)
        .expect((response) => {
          expect(response.body).toMatchObject({
            title: video.title,
            description: video.description,
            url: expect.stringContaining('mp4')
          })
        })
    })

    it('throws an error when the thumbnail is not provided', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
        thumbnailUrl: 'uploads/test.jpg',
        sizeInKb: 1430145,
        duration: 100
      }

      await request(app.getHttpServer())
        .post('/content/video')
        .attach('video', './test/fixtures/sample.mp4')
        .field('title', video.title)
        .field('description', video.description)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((response) => {
          expect(response.body).toMatchObject({
            message: 'Both video and thumbnail files are required.',
            error: 'Bad Request',
            statusCode: 400
          })
        })
    })
  })
})
