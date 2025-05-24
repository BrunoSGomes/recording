import { Inject, Injectable } from '@nestjs/common'
import { SubscriptionModel } from '@billingModule/core/model/subscription.model'
import * as schema from '@billingModule/persistence/database.schema'
import { subscriptionsTable } from '@billingModule/persistence/database.schema'
import { eq, InferSelectModel } from 'drizzle-orm'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { DrizzleDefaultRepository } from '@sharedModules/persistence/drizzle/repository/drizzle-default.repository'

@Injectable()
export class SubscriptionRepository extends DrizzleDefaultRepository<
  SubscriptionModel,
  typeof subscriptionsTable
> {
  constructor(
    @Inject('DB_POSTGRES')
    protected readonly db: PostgresJsDatabase<typeof schema>
  ) {
    super(db, subscriptionsTable)
  }

  async findByUserId(userId: string): Promise<SubscriptionModel | null> {
    const res = await this.db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, userId))
      .limit(1)
    if (res.length === 0) return null
    return this.mapToModel(res[0])
  }

  protected mapToModel(
    data: InferSelectModel<typeof subscriptionsTable>
  ): SubscriptionModel {
    return SubscriptionModel.createFrom(data)
  }
}
