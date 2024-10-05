import { Injectable } from '@nestjs/common'
import { VideoNotFoundException } from '@src/core/exception/video-not-found.exception'
import { VideoRepository } from '@src/persistence/repository/video.repository'

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
