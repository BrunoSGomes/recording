import { faker } from '@faker-js/faker/.'
import {
  SubscriptionModel,
  SubscriptionStatus
} from '@src/module/billing/core/model/subscription.model'
import * as Factory from 'factory.ts'

export const subscriptionFactory = Factory.Sync.makeFactory<SubscriptionModel>({
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
