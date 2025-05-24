import { Inject, Injectable } from '@nestjs/common'
import { DefaultTypeOrmRepository } from '@contentModule/infra/module/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'
import { Content } from '@contentModule/persistence/entity/content.entity'

@Injectable()
export class ContentRepository extends DefaultTypeOrmRepository<Content> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Content, dataSource)
  }
}
