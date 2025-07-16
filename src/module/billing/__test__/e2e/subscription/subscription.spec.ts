import { planFactory } from '@billingModule/__test__/factory/plan.factory'
import { BillingModule } from '@billingModule/billing.module'
import { PlanInterval } from '@billingModule/core/enum/plan-interval.enum'
import { SubscriptionStatus } from '@billingModule/core/enum/subscription-status.enum'
import { faker } from '@faker-js/faker'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { Tables } from '@testInfra/enum/table.enum'
import { testDbClient } from '@testInfra/knex.database'
import { createNestApp } from '@testInfra/test-e2e.setup'
import { randomUUID } from 'crypto'
import request from 'supertest'

const fakeUserId = faker.string.uuid()
jest.mock('jsonwebtoken', () => ({
  verify: (_token: string, _secret: string, _options: any, callback: any) => {
    callback(null, { sub: fakeUserId })
  }
}))
describe('Subscription e2e test', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    const nestTestSetup = await createNestApp([BillingModule])
    app = nestTestSetup.app
    module = nestTestSetup.module
  })

  beforeEach(async () => {
    jest
      .useFakeTimers({ advanceTimers: true })
      .setSystemTime(new Date('2023-01-01'))
  })

  afterEach(async () => {
    await testDbClient(Tables.Subscription).delete()
    await testDbClient(Tables.Plan).delete()
  })

  afterAll(async () => {
    //TODO move it to be shared
    await app.close()
    module.close()
  })

  it('creates a subscription', async () => {
    const plan = planFactory.build({
      name: 'Basic',
      description: 'Basic montly plan',
      currency: 'USD',
      amount: 10,
      interval: PlanInterval.Month,
      trialPeriod: 7
    })
    await testDbClient(Tables.Plan).insert(plan)
    const res = await request(app.getHttpServer())
      .post('/subscription')
      .set('Authorization', `Bearer fake-token`)
      .send({ planId: plan.id })
    expect(res.status).toBe(HttpStatus.CREATED)
    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
      userId: expect.any(String),
      planId: plan.id,
      status: SubscriptionStatus.Active,
      startDate: expect.any(String),
      endDate: null,
      autoRenew: true
    })
  })

  it('throws error if the plan does not exist', async () => {
    const res = await request(app.getHttpServer())
      .post('/subscription')
      .set('Authorization', `Bearer fake-token`)
      .send({ planId: randomUUID() })
    expect(res.status).toBe(HttpStatus.NOT_FOUND)
  })
})
