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

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' }
    }),
    PersistenceModule
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserResolver,
    UserManagementService,
    UserRepository
  ]
})
export class IdentityModule {}
