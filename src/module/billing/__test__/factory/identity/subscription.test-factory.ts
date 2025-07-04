import { SubscriptionStatus } from '@billingModule/core/enum/subscription-status.enum'
import { Subscription } from '@billingModule/persistence/entity/subscription.entity'
import { faker } from '@faker-js/faker/.'

import * as Factory from 'factory.ts'

export const subscriptionFactory = Factory.Sync.makeFactory<
  Partial<Subscription>
>({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  planId: faker.string.uuid(),
  status: SubscriptionStatus.Active,
  startDate: faker.date.recent(),
  endDate: null,
  autoRenew: true,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null
})
