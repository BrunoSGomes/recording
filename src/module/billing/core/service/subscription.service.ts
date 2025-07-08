import { SubscriptionStatus } from '@billingModule/core/enum/subscription-status.enum'
import { Subscription } from '@billingModule/persistence/entity/subscription.entity'
import { PlanRepository } from '@billingModule/persistence/repository/plan.repository'
import { SubscriptionRepository } from '@billingModule/persistence/repository/subscription.repository'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  async createSubscription({
    planId
  }: {
    planId: string
  }): Promise<Subscription> {
    const plan = await this.planRepository.findOneById(planId)
    if (!plan) {
      throw new NotFoundException(`Plan with id ${planId} not found`)
    }
    const subscription = new Subscription({
      plan,
      userId: 'fake-user-id', // Replace with actual user ID
      status: SubscriptionStatus.Active,
      startDate: new Date(),
      autoRenew: true
    })
    await this.subscriptionRepository.save(subscription)
    return subscription
  }

  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.findOneByUserId(userId)
    return subscription?.status === SubscriptionStatus.Active
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOneByUserId(userId)
  }
}
