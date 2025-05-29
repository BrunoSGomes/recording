import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'

import { createNestApp } from '@testInfra/test-e2e.setup'
import request from 'supertest'
import { testDbClient } from '@testInfra/knex.database'
import { Tables } from '@testInfra/enum/table.enum'

describe('AdminTvShowController (e2e)', () => {
  let module: TestingModule
  let app: INestApplication

  beforeAll(async () => {
    const nestTestSetup = await createNestApp()
    app = nestTestSetup.app
    module = nestTestSetup.module
  })

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await testDbClient(Tables.Video).del()
    await testDbClient(Tables.Episode).del()
    await testDbClient(Tables.TvShow).del()
    await testDbClient(Tables.Thumbnail).del()
    await testDbClient(Tables.Content).del()
  })

  afterAll(async () => {
    //TODO move it to be shared
    await app.close()
    await module.close()
  })

  describe('/admin/tv-show (POST)', () => {
    it('creates a new tv show', async () => {
      const tvShow = {
        title: 'Test TvShow',
        description: 'This is a test video',
        thumbnailUrl: 'uploads/test.jpg'
      }

      await request(app.getHttpServer())
        .post('/admin/tv-show')
        .attach('thumbnail', `./test/fixtures/sample.jpg`)
        .field('title', tvShow.title)
        .field('description', tvShow.description)
        .expect(HttpStatus.CREATED)
        .expect((response) => {
          expect(response.body).toMatchObject({
            id: expect.any(String),
            title: tvShow.title,
            description: tvShow.description,
            thumbnailUrl: expect.stringContaining('jpg')
          })
        })
    })

    it('adds an episode to a tv show', async () => {
      const tvShow = {
        title: 'Test TvShow',
        description: 'This is a test video',
        thumbnailUrl: 'uploads/test.jpg'
      }

      const { body } = await request(app.getHttpServer())
        .post('/admin/tv-show')
        .attach('thumbnail', `./test/fixtures/sample.jpg`)
        .field('title', tvShow.title)
        .field('description', tvShow.description)
        .expect(HttpStatus.CREATED)

      const episode = {
        title: 'Test Episode',
        description: 'This is a test episode',
        videoUrl: 'uploads/test.mp4',
        season: 1,
        number: 1,
        sizeInKb: 1430145,
        duration: 100
      }

      await request(app.getHttpServer())
        .post(`/admin/tv-show/${body.id}/upload-episode`)
        .attach('video', `./test/fixtures/sample.mp4`)
        .field('title', episode.title)
        .field('description', episode.description)
        .field('season', episode.season)
        .field('number', episode.number)
        .expect(HttpStatus.CREATED)
        .expect((response) => {
          expect(response.body).toMatchObject({
            title: episode.title,
            description: episode.description,
            videoUrl: expect.stringContaining('mp4'),
            sizeInKb: episode.sizeInKb,
            duration: episode.duration
          })
        })
    })

    it('do not allow creating episode with an existing season and number', async () => {
      const tvShow = {
        title: 'Test TvShow',
        description: 'This is a test video',
        thumbnailUrl: 'uploads/test.jpg'
      }

      const { body } = await request(app.getHttpServer())
        .post('/admin/tv-show')
        .attach('thumbnail', `./test/fixtures/sample.jpg`)
        .field('title', tvShow.title)
        .field('description', tvShow.description)
        .expect(HttpStatus.CREATED)

      const episode = {
        title: 'Test Episode',
        description: 'This is a test episode',
        videoUrl: 'uploads/test.mp4',
        season: 1,
        number: 1,
        sizeInKb: 1430145,
        duration: 100
      }

      /**
       * This can also be done with a test factory
       */
      await request(app.getHttpServer())
        .post(`/admin/tv-show/${body.id}/upload-episode`)
        .attach('video', `./test/fixtures/sample.mp4`)
        .field('title', episode.title)
        .field('description', episode.description)
        .field('season', episode.season)
        .field('number', episode.number)
        .expect(HttpStatus.CREATED)

      await request(app.getHttpServer())
        .post(`/admin/tv-show/${body.id}/upload-episode`)
        .attach('video', `./test/fixtures/sample.mp4`)
        .field('title', episode.title)
        .field('description', episode.description)
        .field('season', episode.season)
        .field('number', episode.number)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((response) => {
          expect(response.body.message).toBe(
            'Episode with season 1 and number 1 already exists'
          )
        })
    })
  })
})
