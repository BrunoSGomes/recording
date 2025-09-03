import { ContentSharedModule } from '@contentModule/shared/content-shared.module'
import { ContentSharedPersistenceModule } from '@contentModule/shared/persistence/content-shared-persistence.module'
import { VideoAgeRecommendationAdapter } from '@contentModule/video-processor/core/adapter/video-recommendation.adapter.interface'
import { VideoSummaryGenerationAdapter } from '@contentModule/video-processor/core/adapter/video-summary-generator.adapter.interface'
import { VideoTranscriptGenerationAdapter } from '@contentModule/video-processor/core/adapter/video-transcript-generator.adapter.interface'
import { GenerateSummaryForVideoUseCase } from '@contentModule/video-processor/core/use-case/generate-summary-for-video.use-case'
import { SetAgeRecommendationUseCase } from '@contentModule/video-processor/core/use-case/set-age-recommendation.use-case'
import { TranscribeVideoUseCase } from '@contentModule/video-processor/core/use-case/transcribe-video.use-case'
import { GeminiTextExtractorClient } from '@contentModule/video-processor/http/client/gemini/gemini-text-extractor.client'
import { VideoMetadataRepository } from '@contentModule/video-processor/persistence/repository/video-metadata.repository'
import { VideoAgeRecommendationConsumer } from '@contentModule/video-processor/queue/consumer/video-age-recommendation.queue-consumer'
import { VideoSummaryConsumer } from '@contentModule/video-processor/queue/consumer/video-summary.queue-consumer'
import { VideoTranscriptionConsumer } from '@contentModule/video-processor/queue/consumer/video-transcription.queue-consumer'
import { ContentAgeRecommendationQueueProducer } from '@contentModule/video-processor/queue/producer/content-age-recommendation.queue-producer'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { HttpClientModule } from '@sharedModules/http-client/http-client.module'
import { LoggerModule } from '@sharedModules/logger/logger.module'

@Module({
  imports: [
    ContentSharedPersistenceModule,
    LoggerModule,
    HttpClientModule,
    ContentSharedModule,
    ConfigModule.forRoot()
  ],
  providers: [
    {
      provide: VideoSummaryGenerationAdapter,
      useClass: GeminiTextExtractorClient
    },
    {
      provide: VideoTranscriptGenerationAdapter,
      useClass: GeminiTextExtractorClient
    },
    {
      provide: VideoAgeRecommendationAdapter,
      useClass: GeminiTextExtractorClient
    },
    VideoAgeRecommendationConsumer,
    VideoSummaryConsumer,
    VideoTranscriptionConsumer,
    GenerateSummaryForVideoUseCase,
    SetAgeRecommendationUseCase,
    TranscribeVideoUseCase,
    ContentAgeRecommendationQueueProducer,
    VideoMetadataRepository
  ]
})
export class ContentVideoProcessorModule {}
