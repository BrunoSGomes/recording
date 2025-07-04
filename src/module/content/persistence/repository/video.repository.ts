import { Video } from '@contentModule/persistence/entity/video.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class VideoRepository extends DefaultTypeOrmRepository<Video> {
  constructor(
    @InjectDataSource('content')
    dataSource: DataSource
  ) {
    super(Video, dataSource.manager)
  }
}
