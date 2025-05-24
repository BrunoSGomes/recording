import { PlanInterval, PlanModel } from '@billingModule/core/model/plan.model'
import { faker } from '@faker-js/faker/.'

import * as Factory from 'factory.ts'

export const planFactory = Factory.Sync.makeFactory<PlanModel>({
  id: faker.string.uuid(),
  name: faker.string.sample(),
  description: faker.string.sample(),
  amount: faker.number.float().toString(),
  currency: faker.finance.currencyCode(),
  interval: PlanInterval.Month,
  trialPeriod: 0,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null
})
