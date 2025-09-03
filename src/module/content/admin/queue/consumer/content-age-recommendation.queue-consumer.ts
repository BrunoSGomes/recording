import { SetAgeRecommendationForContentUseCase } from '@contentModule/admin/core/use-case/set-age-recommendation-for-content.use-case'
import { QUEUES } from '@contentModule/shared/queue/queue.constant'
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { OnApplicationShutdown } from '@nestjs/common'
import { AppLogger } from '@sharedModules/logger/service/app-logger.service'
import { Job } from 'bullmq'

@Processor(QUEUES.CONTENT_AGE_RECOMMENDATION)
export class VideoAgeRecommendationConsumer
  extends WorkerHost
  implements OnApplicationShutdown
{
  constructor(
    private readonly setAgeRecommendationUseCase: SetAgeRecommendationForContentUseCase,
    private readonly logger: AppLogger
  ) {
    super()
  }
  async onApplicationShutdown() {
    await this.worker.close(true)
  }

  async process(
    job: Job<{ videoId: string; ageRecommendation: number }, void>
  ) {
    const { videoId, ageRecommendation } = job.data
    this.logger.log(
      `Processing age recommendation for content with ${job.data.videoId}`
    )

    try {
      await this.setAgeRecommendationUseCase.execute(videoId, ageRecommendation)
    } catch (error) {
      this.logger.error(
        `Error processing age recommendation content for video ${videoId}`,
        {
          error,
          videoId: videoId
        }
      )
      throw new Error(
        `Failed to process age recommendation for content video ID ${videoId}`
      )
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job failed: ${job.id}`, {
      job,
      error
    })
    //Do something with the error, log it, send a notification, put in a dead letter queue, etc.
  }
}
