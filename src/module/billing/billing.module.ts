import { SubscriptionService } from '@billingModule/core/service/subscription.service'
import { SubscriptionController } from '@billingModule/http/rest/controller/subscription.controller'
import { BillingPublicApiProvider } from '@billingModule/integration/provider/public-api.provider'
import { BillingPersistenceModule } from '@billingModule/persistence/billing-persistence.module'
import { Module } from '@nestjs/common'
import { AuthModule } from '@sharedModules/auth/auth.module'

@Module({
  imports: [BillingPersistenceModule, AuthModule],
  providers: [SubscriptionService, BillingPublicApiProvider],
  controllers: [SubscriptionController],
  exports: [BillingPublicApiProvider]
})
export class BillingModule {}
