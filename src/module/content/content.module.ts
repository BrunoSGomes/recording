import { ContentManagementService } from '@contentModule/core/service/content-management.service'
import { MediaPlayerService } from '@contentModule/core/service/media-player.service'
import { ExternalMovieClient } from '@contentModule/http/rest/client/external-movie-rating/external-movie-rating.client'
import { MediaPlayerController } from '@contentModule/http/rest/controller/media-player.controller'
import { AdminMovieController } from '@contentModule/http/rest/controller/admin-movie.controller'
import { PersistenceModule } from '@contentModule/persistence/persistence.module'
import { ContentRepository } from '@contentModule/persistence/repository/content.repository'
import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { HttpClientModule } from '@sharedModules/http-client/http-client.module'

@Module({
  imports: [
    PersistenceModule.forRoot(),
    ConfigModule.forRoot(),
    HttpClientModule
  ],
  controllers: [AdminMovieController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository,
    ExternalMovieClient
  ]
})
export class ContentModule {}
