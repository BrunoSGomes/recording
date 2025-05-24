import { SubscriptionService } from '@billingModule/core/service/subscription.service'
import { Injectable } from '@nestjs/common'
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interface/billing-integration.interface'

@Injectable()
export class BillingPublicApiProvider implements BillingSubscriptionStatusApi {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  public async isUserSubscriptionActive(userId: string): Promise<boolean> {
    return await this.subscriptionService.isUserSubscriptionActive(userId)
  }
}
