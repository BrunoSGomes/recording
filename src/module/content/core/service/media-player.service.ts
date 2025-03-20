import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { Injectable } from '@nestjs/common'
import { VideoNotFoundException } from '../exception/video-not-found.exception'

@Injectable()
export class MediaPlayerService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async prepareStreaming(videoId: string): Promise<string> {
    const video = await this.videoRepository.findOneById(videoId)
    if (!video) {
      throw new VideoNotFoundException(`video with id ${videoId} not found`)
    }
    return video.url
  }
}
