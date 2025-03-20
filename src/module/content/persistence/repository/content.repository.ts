import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { Content } from '../entity/content.entity'
import { DefaultTypeOrmRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository'

@Injectable()
export class ContentRepository extends DefaultTypeOrmRepository<Content> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Content, dataSource)
  }
}
