import { Subscription } from '@billingModule/persistence/entity/subscription.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class SubscriptionRepository extends DefaultTypeOrmRepository<Subscription> {
  constructor(
    @InjectDataSource('billing')
    dataSource: DataSource
  ) {
    super(Subscription, dataSource.manager)
  }

  async findOneByUserId(userId: string): Promise<Subscription | null> {
    return this.findOne({
      where: {
        userId
      }
    })
  }
}
