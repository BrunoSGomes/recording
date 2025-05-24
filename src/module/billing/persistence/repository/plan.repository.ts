import { Inject, Injectable } from '@nestjs/common'
import { DrizzleDefaultRepository } from '@sharedModules/persistence/drizzle/repository/drizzle-default.repository'
import { PlanModel } from '@billingModule/core/model/plan.model'
import * as schema from '@billingModule/persistence/database.schema'
import { plansTable } from '@billingModule/persistence/database.schema'
import { InferSelectModel } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

@Injectable()
export class PlanRepository extends DrizzleDefaultRepository<
  PlanModel,
  typeof plansTable
> {
  constructor(
    @Inject('DB_POSTGRES')
    protected readonly db: PostgresJsDatabase<typeof schema>
  ) {
    super(db, plansTable)
  }

  protected mapToModel(data: InferSelectModel<typeof plansTable>): PlanModel {
    return PlanModel.createFrom(data)
  }
}
