import { ContentModule } from '@contentModule/content.module'
import { IdentityModule } from '@identityModule/identity.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

@Module({
  imports: [
    ContentModule,
    IdentityModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver
    })
  ]
})
export class AppModule {}
