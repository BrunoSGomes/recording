import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '@src/app.module'
import { PrismaService } from '@src/prisma.service'
import fs from 'fs'
import request from 'supertest'

describe('VideoController (e2e)', () => {
  let module: TestingModule
  let app: INestApplication
  let prismaService: PrismaService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = module.createNestApplication()
    await app.init()

    prismaService = module.get<PrismaService>(PrismaService)
  })

  beforeEach(() => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await prismaService.video.deleteMany()
  })

  afterAll(() => {
    module.close()
    fs.rmSync('./uploads', { recursive: true, force: true })
  })

  describe('/video (POST)', () => {
    it('uploads a video', async () => {
      const video = {
        title: 'Test Video',
        description: 'This is a test video',
        videoUrl: 'uploads/test.mp4',
        thumbnailUrl: 'uploads/test.jpg',
        sizeInKb: 1430145,
        duration: 100
      }

      await request(app.getHttpServer())
        .post('/video')
        .attach('video', './test/fixtures/sample.mp4')
        .attach('thumbnail', './test/fixtures/sample.jpg')
        .field('title', video.title)
        .field('description', video.description)
        .expect(HttpStatus.CREATED)
        .expect((response) => {
          expect(response.body).toMatchObject({
            title: video.title,
            description: video.description,
            url: expect.stringContaining('mp4'),
            thumbnailUrl: expect.stringContaining('jpg'),
            sizeInKb: video.sizeInKb,
            duration: video.duration
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
        .post('/video')
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

    // it('does not allow non mp4 files', async () => {
    //   const video = {
    //     title: 'Test Video',
    //     description: 'This is a test video',
    //     videoUrl: 'uploads/test.mp4',
    //     thumbnailUrl: 'uploads/test.jpg',
    //     sizeInKb: 100,
    //     duration: 100
    //   }

    //   await request(app.getHttpServer())
    //     .post('/video')
    //     .attach('video', './test/fixtures/sample.mp3')
    //     .attach('thumbnail', './test/fixtures/sample.jpg')
    //     .field('title', video.title)
    //     .field('description', video.description)
    //     .expect(HttpStatus.BAD_REQUEST)
    //     .expect({
    //       message:
    //         'Invalid file type, only video/mp4, image/png and image/jpeg are supported.',
    //       error: 'Bad Request',
    //       statusCode: 400
    //     })
    // })
  })
})
