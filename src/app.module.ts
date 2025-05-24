import { ContentModule } from '@contentModule/content.module'
import { IdentityModule } from '@identityModule/identity.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [ContentModule, IdentityModule]
})
export class AppModule {}
