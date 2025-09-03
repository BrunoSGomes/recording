import { VideoMetadata } from '@contentModule/shared/persistence/entity/video-metadata.entity'
import { Video } from '@contentModule/shared/persistence/entity/video.entity'
import {
  AgeRecommendationSchema,
  VideoAgeRecommendationAdapter
} from '@contentModule/video-processor/core/adapter/video-recommendation.adapter.interface'
import { VideoMetadataRepository } from '@contentModule/video-processor/persistence/repository/video-metadata.repository'
import { ContentAgeRecommendationQueueProducer } from '@contentModule/video-processor/queue/producer/content-age-recommendation.queue-producer'
import { Inject, Injectable } from '@nestjs/common'
import { AppLogger } from '@sharedModules/logger/service/app-logger.service'

import { runInTransaction } from 'typeorm-transactional'

@Injectable()
export class SetAgeRecommendationUseCase {
  constructor(
    @Inject(VideoAgeRecommendationAdapter)
    private readonly videoAgeRecommendationAdapter: VideoAgeRecommendationAdapter,
    private readonly videoMetadataRepository: VideoMetadataRepository,
    private readonly contentAgeRecommendationQueueProducer: ContentAgeRecommendationQueueProducer,
    private readonly logger: AppLogger
  ) {}

  public async execute(video: Video): Promise<void> {
    const ageRecommendation =
      await this.videoAgeRecommendationAdapter.getAgeRecommendation(video.url)
    if (!ageRecommendation) {
      throw new Error(
        `Failed to generate age recommendation for video with ID ${video.id}`
      )
    }
    this.logger.log(`Generated age recommendation for video ID ${video.id}`, {
      ageRecommendation,
      videoId: video.id
    })

    const metadata = await this.getAndPopulateMetadata(video, ageRecommendation)

    await runInTransaction(
      async () => {
        await this.videoMetadataRepository.save(metadata)
        await this.contentAgeRecommendationQueueProducer.processContentAgeRecommendation(
          metadata
        )
      },
      {
        connectionName: 'content'
      }
    )
  }

  private async getAndPopulateMetadata(
    video: Video,
    ageRecommendation: AgeRecommendationSchema
  ): Promise<VideoMetadata> {
    const metadata = await this.videoMetadataRepository.findOne({
      where: { video }
    })

    if (metadata) {
      metadata.ageRating = ageRecommendation?.ageRating
      metadata.ageRatingExplanation = ageRecommendation?.explanation
      metadata.ageRatingCategories = ageRecommendation?.categories
      return metadata
    }

    return new VideoMetadata({
      ageRating: ageRecommendation?.ageRating,
      ageRatingExplanation: ageRecommendation?.explanation,
      ageRatingCategories: ageRecommendation?.categories,
      video
    })
  }
}
