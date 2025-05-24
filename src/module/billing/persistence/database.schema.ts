import { PlanInterval } from '@billingModule/core/model/plan.model'
import { SubscriptionStatus } from '@billingModule/core/model/subscription.model'
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any
}
export const status = pgEnum('status', enumToPgEnum(SubscriptionStatus))
export const planInterval = pgEnum('planInterval', enumToPgEnum(PlanInterval))

export const plansTable = pgTable('Plan', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
  amount: numeric('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  interval: planInterval('interval').notNull(),
  trialPeriod: integer('trialPeriod'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt')
})

export const subscriptionsTable = pgTable('Subscription', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('userId', { length: 36 }).notNull(),
  planId: varchar('planId', { length: 36 })
    .notNull()
    .references(() => plansTable.id),
  status: status('status').notNull().default(SubscriptionStatus.Inactive),
  startDate: timestamp('startDate').notNull().defaultNow(),
  endDate: timestamp('endDate'),
  autoRenew: boolean('autoRenew').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt')
})
