import { UserUnauthorizedException } from '@identityModule/core/exception/user-unauthorized.exception'
import { UserRepository } from '@identityModule/persistence/repository/user.repository'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interface/billing-integration.interface'
import { compare } from 'bcrypt'

// TODO: move this to a .env file and config
export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(BillingSubscriptionStatusApi)
    private readonly subscriptionServiceClient: BillingSubscriptionStatusApi
  ) {}

  async signIn(
    email: string,
    password: string
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneByEmail(email)

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedException(`Cannot authorize user: ${email}`)
    }
    const isSubscriptionActive =
      await this.subscriptionServiceClient.isUserSubscriptionActive(user.id)
    if (!isSubscriptionActive) {
      throw new UserUnauthorizedException(
        `User subscription is not active: ${email}`
      )
    }
    //TODO add more fields to the JWT
    const payload = { sub: user.id }
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        // Using HS256 algorithm to prenvent from security risk
        // https://book.hacktricks.xyz/pentesting-web/hacking-jwt-json-web-tokens#modify-the-algorithm-to-none-cve-2015-9235
        algorithm: 'HS256'
      })
    }
  }
  private async comparePassword(
    password: string,
    actualPassword: string
  ): Promise<boolean> {
    return compare(password, actualPassword)
  }
}
