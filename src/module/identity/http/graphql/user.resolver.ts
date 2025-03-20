import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserManagementService } from '@identityModule/core/service/user-management.service'
import {
  AuthGuard,
  AuthenticatedRequest
} from '@identityModule/http/guard/auth.guard'
import { CreateUserInput } from './type/create-user-input.type'
import { User } from './type/user.type'

@Resolver()
export class UserResolver {
  constructor(private readonly userManagementService: UserManagementService) {}
  @Mutation(() => User)
  async createUser(
    @Args('CreateUserInput') createUserInput: CreateUserInput
  ): Promise<User> {
    const user = await this.userManagementService.create(createUserInput)
    return user
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getProfile(
    @Context('req')
    req: AuthenticatedRequest
  ): Promise<User> {
    return req.user
  }
}
