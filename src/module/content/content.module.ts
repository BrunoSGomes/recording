import { ContentAdminModule } from '@contentModule/admin/content-admin.module'
import { ContentCatalogModule } from '@contentModule/catalog/content-catalog.module'
import { ContentVideoProcessorModule } from '@contentModule/video-processor/content-video-processor.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    ContentAdminModule,
    ContentVideoProcessorModule,
    ContentCatalogModule
  ]
})
export class ContentModule {}
