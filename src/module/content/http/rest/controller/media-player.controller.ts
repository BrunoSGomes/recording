import { VideoNotFoundException } from '@contentModule/core/exception/video-not-found.exception'
import { MediaPlayerService } from '@contentModule/core/service/media-player.service'
import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  Req,
  Res
} from '@nestjs/common'
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

@Controller('stream')
export class MediaPlayerController {
  constructor(private readonly mediaPlayerService: MediaPlayerService) {}

  @Get(':videoId')
  @Header('Content-Type', 'video/mp4')
  async streamVideo(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const url = await this.mediaPlayerService.prepareStreaming(videoId)

      const videoPath = path.join('.', url)
      const fileSize = fs.statSync(videoPath).size

      const range = req.headers.range

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

        const chunksize = end - start + 1
        const file = fs.createReadStream(videoPath, { start, end })

        res.writeHead(HttpStatus.PARTIAL_CONTENT, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4'
        })

        file.pipe(res)
      } else {
        res.writeHead(HttpStatus.OK, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        })
        fs.createReadStream(videoPath).pipe(res)
      }
    } catch (error) {
      if (error instanceof VideoNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: error.message,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND
        })
      }
      throw error
    }
  }
}
