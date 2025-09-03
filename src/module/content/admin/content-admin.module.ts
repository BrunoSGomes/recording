import { ContentAgeRecommendationService } from '@contentModule/admin/core/service/content-age-recommendation.service'
import { ContentDistributionService } from '@contentModule/admin/core/service/content-distribution.service'
import { EpisodeLifecycleService } from '@contentModule/admin/core/service/episode-lifecycle.service'
import { VideoProcessorService } from '@contentModule/admin/core/service/video-processor.service'
import { CreateMovieUseCase } from '@contentModule/admin/core/use-case/create-movie.use-case'
import { CreateTvShowEpisodeUseCase } from '@contentModule/admin/core/use-case/create-tv-show-episode.use-case'
import { CreateTvShowUseCase } from '@contentModule/admin/core/use-case/create-tv-show.use-case'
import { SetAgeRecommendationForContentUseCase } from '@contentModule/admin/core/use-case/set-age-recommendation-for-content.use-case'
import { ExternalMovieClient } from '@contentModule/admin/http/client/external-movie-rating/external-movie-rating.client'
import { AdminMovieController } from '@contentModule/admin/http/rest/controller/admin-movie.controller'
import { AdminTvShowController } from '@contentModule/admin/http/rest/controller/admin-tv-show.controller'
import { ContentRepository } from '@contentModule/admin/persistence/repository/content.repository'
import { EpisodeRepository } from '@contentModule/admin/persistence/repository/episode.repository'
import { VideoProcessingJobProducer } from '@contentModule/admin/queue/producer/video-processing-job.queue-producer'
import { ContentSharedModule } from '@contentModule/shared/content-shared.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { HttpClientModule } from '@sharedModules/http-client/http-client.module'
import { LoggerModule } from '@sharedModules/logger/logger.module'
@Module({
  imports: [
    ContentSharedModule,
    LoggerModule,
    HttpClientModule,
    ConfigModule.forRoot()
  ],
  providers: [
    ExternalMovieClient,
    CreateTvShowEpisodeUseCase,
    ContentAgeRecommendationService,
    ContentDistributionService,
    EpisodeLifecycleService,
    VideoProcessorService,
    CreateMovieUseCase,
    CreateTvShowEpisodeUseCase,
    CreateMovieUseCase,
    CreateTvShowUseCase,
    VideoProcessingJobProducer,
    SetAgeRecommendationForContentUseCase,
    ContentRepository,
    EpisodeRepository
  ],
  controllers: [AdminMovieController, AdminTvShowController]
})
export class ContentAdminModule {}
