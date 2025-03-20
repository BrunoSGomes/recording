import { ContentManagementService } from '@contentModule/core/service/content-management.service'
import { MediaPlayerService } from '@contentModule/core/service/media-player.service'
import { ExternalMovieClient } from '@contentModule/http/rest/client/external-movie-rating/external-movie-rating.client'
import { MediaPlayerController } from '@contentModule/http/rest/controller/media-player.controller'
import { VideoUploadController } from '@contentModule/http/rest/controller/video-upload.controller'
import { HttpClient } from '@contentModule/infra/http/client/http.client'
import { PersistenceModule } from '@contentModule/persistence/persistence.module'
import { ContentRepository } from '@contentModule/persistence/repository/content.repository'
import { VideoRepository } from '@contentModule/persistence/repository/video.repository'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'

@Module({
  imports: [PersistenceModule.forRoot(), ConfigModule.forRoot()],
  controllers: [VideoUploadController, MediaPlayerController],
  providers: [
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository,
    ExternalMovieClient,
    HttpClient
  ]
})
export class ContentModule {}
