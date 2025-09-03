import { CreateMovieUseCase } from '@contentModule/admin/core/use-case/create-movie.use-case'
import { CreateVideoResponseDto } from '@contentModule/admin/http/rest/dto/response/create-video-response.dto'
import { RestResponseInterceptor } from '@contentModule/shared/http/rest/interceptor/rest-response.interceptor'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('admin')
export class AdminMovieController {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  @Post('movie')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
      ],
      {
        dest: './uploads',
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, cb) => {
            return cb(
              null,
              `${Date.now()}-${randomUUID()}${extname(file.originalname)}`
            )
          }
        }),
        fileFilter: (_req, file, cb) => {
          if (file.mimetype !== 'video/mp4' && file.mimetype !== 'image/jpeg') {
            return cb(
              new BadRequestException(
                'Invalid file type. Only video/mp4 and image/jpeg are supported.'
              ),
              false
            )
          }
          return cb(null, true)
        }
      }
    )
  )
  @UseInterceptors(new RestResponseInterceptor(CreateVideoResponseDto))
  async uploadMovie(
    @Req() _req: Request,
    @Body()
    contentData: {
      title: string
      description: string
    },
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] }
  ): Promise<CreateVideoResponseDto> {
    const videoFile = files.video?.[0]
    const thumbnailFile = files.thumbnail?.[0]

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.'
      )
    }

    const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1 gigabyte

    if (videoFile.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds the limit.')
    }
    const MAX_THUMBNAIL_SIZE = 1024 * 1024 * 10 // 10 megabytes

    if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
      throw new BadRequestException('Thumbnail size exceeds the limit.')
    }

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.'
      )
    }

    const createdMovie = await this.createMovieUseCase.execute({
      title: contentData.title,
      description: contentData.description,
      videoUrl: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size
    })
    return {
      id: createdMovie.id,
      title: createdMovie.title,
      description: createdMovie.description,
      url: createdMovie.movie.video.url,
      thumbnailUrl: createdMovie.movie.thumbnail?.url,
      sizeInKb: createdMovie.movie.video.sizeInKb,
      duration: createdMovie.movie.video.duration,
      createdAt: createdMovie.createdAt,
      updatedAt: createdMovie.updatedAt
    }
  }
}
