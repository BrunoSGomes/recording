import { CreateTvShowEpisodeUseCase } from '@contentModule/admin/core/use-case/create-tv-show-episode.use-case'
import { CreateTvShowUseCase } from '@contentModule/admin/core/use-case/create-tv-show.use-case'
import { CreateEpisodeRequestDto } from '@contentModule/admin/http/rest/dto/request/create-episode-request.dto'
import { CreateTvShowRequestDto } from '@contentModule/admin/http/rest/dto/request/create-tv-show-request.dto'
import { CreateEpisodeResponseDto } from '@contentModule/admin/http/rest/dto/response/create-episode-response.dto'
import { CreateTvShowResponseDto } from '@contentModule/admin/http/rest/dto/response/create-tv-show-response.dto'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Request } from 'express'
import { diskStorage } from 'multer'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'

@Controller('admin/tv-show')
export class AdminTvShowController {
  constructor(
    private readonly createTvShowUseCase: CreateTvShowUseCase,
    private readonly createEspisodeUseCase: CreateTvShowEpisodeUseCase
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          return cb(
            null,
            `${Date.now()}-${randomUUID()}${extname(file.originalname)}`
          )
        }
      })
    })
  )
  async createTvShowContent(
    @Req() _req: Request,
    @Body() contentData: CreateTvShowRequestDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg'
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024
        })
        .build()
    )
    thumbnail: Express.Multer.File
  ): Promise<CreateTvShowResponseDto> {
    const content = await this.createTvShowUseCase.execute({
      title: contentData.title,
      description: contentData.description,
      thumbnailUrl: thumbnail.path
    })
    return {
      id: content.id,
      tvShowId: content.tvShow.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.tvShow?.thumbnail?.url
    }
  }

  @Post(':contentId/upload-episode')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          return cb(
            null,
            `${Date.now()}-${randomUUID()}${extname(file.originalname)}`
          )
        }
      })
    })
  )
  async uploadEpisodeToTvShowContent(
    @Req() _req: Request,
    @Body() episodeData: CreateEpisodeRequestDto,
    @Param('contentId') contentId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'mp4'
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 1024
        })
        .build()
    )
    video: Express.Multer.File
  ): Promise<CreateEpisodeResponseDto> {
    if (!video) {
      throw new BadRequestException('Video file is required.')
    }

    const createdEpisode = await this.createEspisodeUseCase.execute({
      ...episodeData,
      videoUrl: video.path,
      videoSizeInKb: video.size,
      contentId
    })

    return {
      id: createdEpisode.id,
      title: createdEpisode.title,
      description: createdEpisode.description,
      videoUrl: createdEpisode.video?.url,
      duration: createdEpisode.video?.duration,
      sizeInKb: createdEpisode.video?.sizeInKb
    }
  }
}
