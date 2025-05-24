import { Module } from '@nestjs/common'
import { ConfigModule } from '@sharedModules/config/config.module'
import { HttpClientModule } from '@sharedModules/http-client/http-client.module'
import { BillingSubscriptionHttpClient } from '@sharedModules/integration/client/billing-subscription-http.client'

@Module({
  imports: [ConfigModule.forRoot(), HttpClientModule],
  providers: [BillingSubscriptionHttpClient],
  exports: [BillingSubscriptionHttpClient]
})
export class DomainModuleIntegrationModule {}
