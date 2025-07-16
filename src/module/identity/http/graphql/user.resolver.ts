import { UserManagementService } from '@identityModule/core/service/user-management.service'
import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthGuard } from '@sharedModules/auth/guard/auth.guard'
import { ClsService } from 'nestjs-cls'
import { CreateUserInput } from './type/create-user-input.type'
import { User } from './type/user.type'

@Resolver()
export class UserResolver {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly clsService: ClsService
  ) {}
  @Mutation(() => User)
  async createUser(
    @Args('CreateUserInput') createUserInput: CreateUserInput
  ): Promise<User> {
    const user = await this.userManagementService.create(createUserInput)
    return user
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getProfile(): Promise<User> {
    const userId = this.clsService.get('userId')
    const user = await this.userManagementService.getUserById(userId)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }
}
