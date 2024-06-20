import { Module } from '@nestjs/common'
import { PrismaService } from '@src/persistence/prisma/prisma.service'
import { ContentController } from './http/rest/controller/content.controller'
import { ContentManagementService } from './core/service/content-management.service'
import { MediaPlayerService } from './core/service/media-player.service'
import { ContentRepository } from './persistence/repository/content.repository'
import { VideoRepository } from './persistence/repository/video.repository'
import { MediaPlayerController } from './http/rest/controller/media-player.controller'

@Module({
  imports: [],
  controllers: [ContentController, MediaPlayerController],
  providers: [
    PrismaService,
    ContentManagementService,
    MediaPlayerService,
    ContentRepository,
    VideoRepository
  ]
})
export class AppModule {}
