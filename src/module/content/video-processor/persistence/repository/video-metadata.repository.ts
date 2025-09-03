import { VideoMetadata } from '@contentModule/shared/persistence/entity/video-metadata.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class VideoMetadataRepository extends DefaultTypeOrmRepository<VideoMetadata> {
  constructor(
    @InjectDataSource('content')
    dataSource: DataSource
  ) {
    super(VideoMetadata, dataSource.manager)
  }
}
