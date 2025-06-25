import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class GetStreamingURLUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}

  async execute(videoId: string): Promise<string> {
    const video = await this.videoRepository.findOneById(videoId)
    if (!video) {
      throw new NotFoundException(`video with id ${videoId} not found`)
    }
    return video.url
  }
}
