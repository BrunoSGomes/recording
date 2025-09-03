import { contentFactory } from '@contentModule/__test__/factory/content.factory'
import { movieFactory } from '@contentModule/__test__/factory/movie.factory'
import { videoMetadataFactory } from '@contentModule/__test__/factory/video-metadata.factory'
import { videoFactory } from '@contentModule/__test__/factory/video.factory'
import { CONTENT_TEST_FIXTURES } from '@contentModule/__test__/test.constant'
import { Video } from '@contentModule/shared/persistence/entity/video.entity'
import { ContentVideoProcessorModule } from '@contentModule/video-processor/content-video-processor.module'
import { TranscribeVideoUseCase } from '@contentModule/video-processor/core/use-case/transcribe-video.use-case'
import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { ConfigService } from '@sharedModules/config/service/config.service'
import { Tables } from '@testInfra/enum/table.enum'
import { createNestApp } from '@testInfra/test-e2e.setup'
import knex, { Knex } from 'knex'
import nock, { cleanAll } from 'nock'

describe('TranscribeVideoUseCase', () => {
  let module: TestingModule
  let app: INestApplication
  let testDbClient: Knex
  let transcribeVideoUseCase: TranscribeVideoUseCase

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([ContentVideoProcessorModule])
    app = nestTestSetup.app
    module = nestTestSetup.module
    const configService = module.get<ConfigService>(ConfigService)
    transcribeVideoUseCase = module.get<TranscribeVideoUseCase>(
      TranscribeVideoUseCase
    )

    testDbClient = knex({
      client: 'pg',
      connection: `${configService.get('database.url')}`,
      searchPath: ['public']
    })
  })

  afterEach(async () => {
    await testDbClient(Tables.VideoMetadata).del()

    await testDbClient(Tables.Video).del()
    await testDbClient(Tables.Movie).del()
    await testDbClient(Tables.Thumbnail).del()
    await testDbClient(Tables.Content).del()

    cleanAll()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    //TODO move it to be shared
    await app.close()
    await module.close()
  })

  it('generates a transcript for a video with existing metadata', async () => {
    const content = contentFactory.build()
    const movie = movieFactory.build({
      contentId: content.id
    })
    const video = videoFactory.build({
      url: `${CONTENT_TEST_FIXTURES}/sample.mp4`,
      movieId: movie.id
    })
    const videoMetadata = videoMetadataFactory.build({
      videoId: video.id
    })
    await testDbClient('Content').insert(content)
    await testDbClient('Movie').insert(movie)
    await testDbClient('Video').insert(video)
    await testDbClient('VideoMetadata').insert(videoMetadata)

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

    const videoEntity = new Video(video)

    await transcribeVideoUseCase.execute(videoEntity)
    const updatedVideoMetadata = await testDbClient('VideoMetadata')
      .where({ videoId: video.id })
      .first()
    expect(updatedVideoMetadata).toBeDefined()
    expect(updatedVideoMetadata.transcript).toEqual(
      'This is a test video transcript.'
    )
  })

  it('creates new metadata when no metadata exists for the video', async () => {
    // Create content without metadata
    const content = contentFactory.build()
    const movie = movieFactory.build({
      contentId: content.id
    })
    const video = videoFactory.build({
      url: `${CONTENT_TEST_FIXTURES}/sample.mp4`,
      movieId: movie.id
    })
    await testDbClient('Content').insert(content)
    await testDbClient('Movie').insert(movie)
    await testDbClient('Video').insert(video)

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
                    responseText: 'This is a new test video transcript.'
                  })
                }
              ]
            },
            finishReason: 'STOP',
            index: 0
          }
        ]
      })

    const videoEntity = new Video(video)

    await transcribeVideoUseCase.execute(videoEntity)

    const newMetadata = await testDbClient('VideoMetadata')
      .where({ videoId: video.id })
      .first()

    expect(newMetadata).toBeDefined()
    expect(newMetadata.transcript).toEqual(
      'This is a new test video transcript.'
    )
  })

  it('handles API errors during transcript generation', async () => {
    const content = contentFactory.build()
    const movie = movieFactory.build({
      contentId: content.id
    })
    const video = videoFactory.build({
      url: `${CONTENT_TEST_FIXTURES}/sample.mp4`,
      movieId: movie.id
    })
    await testDbClient('Content').insert(content)
    await testDbClient('Movie').insert(movie)
    await testDbClient('Video').insert(video)

    // Mock the API to throw an error
    nock('https://generativelanguage.googleapis.com')
      .post('/v1beta/models/gemini-2.0-flash:generateContent')
      .query(true)
      .replyWithError('API connection error')

    const videoEntity = new Video(video)

    await expect(transcribeVideoUseCase.execute(videoEntity)).rejects.toThrow()
  })
})
