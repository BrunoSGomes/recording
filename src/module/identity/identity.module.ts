import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserManagementService } from './core/service/user-management.service'
import { AuthResolver } from './http/graphql/auth.resolver'
import { UserResolver } from './http/graphql/user.resolver'
import { UserRepository } from './persistence/repository/user.repository'
import {
  AuthService,
  jwtConstants
} from '@identityModule/core/service/authentication.service'
import { PersistenceModule } from '@sharedModules/persistence/prisma/persistence.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { DomainModuleIntegrationModule } from '@sharedModules/integration/interface/domain-module-integration.module'
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interface/billing-integration.interface'
import { BillingSubscriptionRepository } from '@identityModule/persistence/repository/external/billing-subscription.repository'
import { BillingPublicApiProvider } from '@billingModule/integration/provider/public-api.provider'
import { BillingModule } from '@billingModule/billing.module'

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' }
    }),
    PersistenceModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver
    }),
    DomainModuleIntegrationModule,
    BillingModule
  ],
  providers: [
    {
      provide: BillingSubscriptionStatusApi,
      useExisting: BillingPublicApiProvider
    },
    AuthService,
    AuthResolver,
    UserResolver,
    UserManagementService,
    UserRepository,
    BillingSubscriptionRepository
  ]
})
export class IdentityModule {}
