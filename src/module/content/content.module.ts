import { VideoAgeRecommendationAdapter } from '@contentModule/core/adapter/video-recommendation.adapter.interface'
import { VideoSummaryGenerationAdapter } from '@contentModule/core/adapter/video-summary-generator.adapter.interface'
import { VideoTranscriptGenerationAdapter } from '@contentModule/core/adapter/video-transcript-generator.adapter.interface'
import { AgeRecommendationService } from '@contentModule/core/service/age-recommendation.service'
import { ContentDistributionService } from '@contentModule/core/service/content-distribution.service'
import { EpisodeLifecycleService } from '@contentModule/core/service/episode-lifecycle.service'
import { VideoProcessorService } from '@contentModule/core/service/video-processor.service'
import { VideoProfanityFilterService } from '@contentModule/core/service/video-profanity-filter.service'
import { CreateMovieUseCase } from '@contentModule/core/use-case/create-movie.use-case'
import { CreateTvShowEpisodeUseCase } from '@contentModule/core/use-case/create-tv-show-episode.use-case'
import { CreateTvShowUseCase } from '@contentModule/core/use-case/create-tv-show.use-case'
import { GetStreamingURLUseCase } from '@contentModule/core/use-case/get-streaming-url.use-case'
import { ExternalMovieClient } from '@contentModule/http/client/external-movie-rating/external-movie-rating.client'
import { GeminiTextExtractorClient } from '@contentModule/http/client/gemini/gemini-text-extractor.client'
import { AdminMovieController } from '@contentModule/http/rest/controller/admin-movie.controller'
import { AdminTvShowController } from '@contentModule/http/rest/controller/admin-tv-show.controller'
import { MediaPlayerController } from '@contentModule/http/rest/controller/media-player.controller'
import { ContentPersistenceModule } from '@contentModule/persistence/content-persistence.module'
import { ContentRepository } from '@contentModule/persistence/repository/content.repository'
import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { Module } from '@nestjs/common'
import { AuthModule } from '@sharedModules/auth/auth.module'
import { ConfigModule } from '@sharedModules/config/config.module'
import { HttpClientModule } from '@sharedModules/http-client/http-client.module'
import { LoggerModule } from '@sharedModules/logger/logger.module'

@Module({
  imports: [
    ContentPersistenceModule,
    ConfigModule.forRoot(),
    HttpClientModule,
    AuthModule,
    LoggerModule
  ],
  controllers: [
    AdminMovieController,
    MediaPlayerController,
    AdminTvShowController
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
    ContentRepository,
    VideoRepository,
    ExternalMovieClient,
    AgeRecommendationService,
    VideoProfanityFilterService,
    VideoProcessorService,
    EpisodeLifecycleService,
    CreateMovieUseCase,
    CreateTvShowEpisodeUseCase,
    CreateTvShowUseCase,
    GetStreamingURLUseCase,
    ContentDistributionService
  ]
})
export class ContentModule {}
