import { Module } from '@nestjs/common'
import { SubscriptionService } from '@billingModule/core/service/subscription.service'
import { SubscriptionController } from '@billingModule/http/rest/controller/subscription.controller'
import { BillingPersistenceModule } from '@billingModule/persistence/billing-persistence.module'
import { BillingPublicApiProvider } from '@billingModule/integration/provider/public-api.provider'

@Module({
  imports: [BillingPersistenceModule],
  providers: [SubscriptionService, BillingPublicApiProvider],
  controllers: [SubscriptionController],
  exports: [BillingPublicApiProvider]
})
export class BillingModule {}
