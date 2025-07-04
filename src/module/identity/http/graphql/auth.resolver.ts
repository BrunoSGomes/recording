import { AuthService } from '@identityModule/core/service/authentication.service'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthToken } from './type/auth-token.type'
import { SignInInput } from './type/sign-in-input.type'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthToken)
  async signIn(
    @Args('SignInInput') signInInput: SignInInput
  ): Promise<AuthToken> {
    const { email, password } = signInInput
    const token = await this.authService.signIn(email, password)
    return token
  }
}
