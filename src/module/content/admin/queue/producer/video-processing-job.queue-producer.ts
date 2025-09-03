import { Video } from '@contentModule/shared/persistence/entity/video.entity'
import { QUEUES } from '@contentModule/shared/queue/queue.constant'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { AppLogger } from '@sharedModules/logger/service/app-logger.service'
import { Queue } from 'bullmq'

@Injectable()
export class VideoProcessingJobProducer {
  constructor(
    @InjectQueue(QUEUES.VIDEO_AGE_RECOMMENDATION)
    private videoRecommendationQueue: Queue,
    @InjectQueue(QUEUES.VIDEO_TRANSCRIPT) private videoTranscriptQueue: Queue,
    @InjectQueue(QUEUES.VIDEO_SUMMARY) private videoSummaryQueue: Queue,
    private readonly logger: AppLogger
  ) {}

  private createVideoProcessingJob(video: Video) {
    return {
      videoId: video.id,
      url: video.url
    }
  }

  async processRecommendation(video: Video) {
    this.logger.log(
      `Queueing video recommendation processing job for video ID: ${video.id}`
    )

    const job = await this.videoRecommendationQueue.add(
      'process',
      this.createVideoProcessingJob(video)
    )

    this.logger.log(
      `Video recommendation processing job created with ID: ${job.id} for video ID: ${video.id}`
    )
    return job.id
  }

  async processTranscript(video: Video) {
    this.logger.log(
      `Queueing video transcript processing job for video ID: ${video.id}`
    )

    const job = await this.videoTranscriptQueue.add(
      'process',
      this.createVideoProcessingJob(video)
    )

    this.logger.log(
      `Video transcript processing job created with ID: ${job.id} for video ID: ${video.id}`
    )
    return job.id
  }

  async processSummary(video: Video) {
    this.logger.log(
      `Queueing video summary processing job for video ID: ${video.id}`
    )

    const job = await this.videoSummaryQueue.add(
      'process',
      this.createVideoProcessingJob(video)
    )

    this.logger.log(
      `Video summary processing job created with ID: ${job.id} for video ID: ${video.id}`
    )
    return job.id
  }
}
