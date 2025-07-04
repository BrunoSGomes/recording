import { User } from '@identityModule/persistence/entity/user.entity'
import { UserRepository } from '@identityModule/persistence/repository/user.repository'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcrypt'

export interface CreateUserDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

//TODO move to a configuration
export const PASSWORD_HASH_SALT = 10

@Injectable()
export class UserManagementService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(user: CreateUserDto) {
    const newUser = new User({
      ...user,
      password: await hash(user.password, PASSWORD_HASH_SALT)
    })

    await this.userRepository.save(newUser)
    return newUser
  }

  async getUserById(id: string) {
    return this.userRepository.findOneById(id)
  }
}
