import { User } from '@identityModule/persistence/entity/user.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class UserRepository extends DefaultTypeOrmRepository<User> {
  constructor(
    @InjectDataSource('identity')
    dataSource: DataSource
  ) {
    super(User, dataSource.manager)
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: {
        email
      }
    })
  }
}
