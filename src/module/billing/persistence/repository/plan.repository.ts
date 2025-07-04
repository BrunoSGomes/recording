import { Plan } from '@billingModule/persistence/entity/plan.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class PlanRepository extends DefaultTypeOrmRepository<Plan> {
  constructor(
    @InjectDataSource('billing')
    dataSource: DataSource
  ) {
    super(Plan, dataSource.manager)
  }
}
