import { contentFactory } from '@contentModule/__test__/factory/content.factory'
import { tvShowFactory } from '@contentModule/__test__/factory/tv-show.factory'
import { CONTENT_TEST_FIXTURES } from '@contentModule/__test__/test.constant'
import { ContentAdminModule } from '@contentModule/admin/content-admin.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'

import { Tables } from '@testInfra/enum/table.enum'
import { testDbClient } from '@testInfra/knex.database'
import { createNestApp } from '@testInfra/test-e2e.setup'
import fs from 'fs'
import request from 'supertest'

describe('AdminTvShowController (e2e)', () => {
  let module: TestingModule
  let app: INestApplication

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([ContentAdminModule])
    app = nestTestSetup.app
    module = nestTestSetup.module
  })

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await testDbClient(Tables.VideoMetadata).del()

    await testDbClient(Tables.Video).del()
    await testDbClient(Tables.Episode).del()
    await testDbClient(Tables.TvShow).del()
    await testDbClient(Tables.Thumbnail).del()
    await testDbClient(Tables.Content).del()
  })

  afterAll(async () => {
    await app.close()
    await module.close()
    fs.rmSync('./uploads', { recursive: true, force: true })
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
        .attach('thumbnail', `${CONTENT_TEST_FIXTURES}/sample.jpg`)
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
      const content = contentFactory.build()
      const tvShow = tvShowFactory.build({
        contentId: content.id
      })
      await testDbClient(Tables.Content).insert(content)
      await testDbClient(Tables.TvShow).insert(tvShow)

      const episode = {
        title: 'Test Episode',
        description: 'This is a test episode',
        videoUrl: 'uploads/test.mp4',
        season: 1,
        number: 1,
        sizeInKb: 1430145,
        duration: null
      }

      await request(app.getHttpServer())
        .post(`/admin/tv-show/${content.id}/upload-episode`)
        .attach('video', `${CONTENT_TEST_FIXTURES}/sample.mp4`)
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
        .attach('thumbnail', `${CONTENT_TEST_FIXTURES}/sample.jpg`)
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
        duration: null
      }

      /**
       * This can also be done with a test factory
       */
      await request(app.getHttpServer())
        .post(`/admin/tv-show/${body.id}/upload-episode`)
        .attach('video', `${CONTENT_TEST_FIXTURES}/sample.mp4`)
        .field('title', episode.title)
        .field('description', episode.description)
        .field('season', episode.season)
        .field('number', episode.number)
        .expect(HttpStatus.CREATED)

      await request(app.getHttpServer())
        .post(`/admin/tv-show/${body.id}/upload-episode`)
        .attach('video', `${CONTENT_TEST_FIXTURES}/sample.mp4`)
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
