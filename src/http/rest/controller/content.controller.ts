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
import { ContentManagementService } from '@src/core/service/content-management.service'
import { randomUUID } from 'crypto'
import { Request } from 'express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { RestResponseInterceptor } from '../interceptor/rest-response.interceptor'
import { CreateVideoResponseDto } from '../dto/response/create-video-response.dto'

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentManagementService: ContentManagementService
  ) {}

  @Post('video')
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
          if (
            file.mimetype !== 'video/mp4' &&
            file.mimetype !== 'image/jpeg' &&
            file.mimetype !== 'image/png'
          ) {
            return cb(
              new BadRequestException(
                'Invalid file type, only video/mp4, image/png and image/jpeg are supported.'
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
  public async uploadVideo(
    @Req() _req: Request,
    @Body()
    contentData: {
      title: string
      description: string
    },
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] }
  ): Promise<any> {
    const videoFile = files.video?.[0]
    const thumbnailFile = files.thumbnail?.[0]

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.'
      )
    }

    const createdContent = await this.contentManagementService.createContent({
      title: contentData.title,
      description: contentData.description,
      url: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size
    })

    const video = createdContent.getMedia()?.getVideo()
    if (!video) {
      throw new BadRequestException('Video must be present.')
    }

    return {
      id: createdContent.getId(),
      title: createdContent.getTitle(),
      description: createdContent.getDescription(),
      url: video.getUrl(),
      createdAt: createdContent.getCreatedAt(),
      updatedAt: createdContent.getUpdatedAt()
    }
  }
}
