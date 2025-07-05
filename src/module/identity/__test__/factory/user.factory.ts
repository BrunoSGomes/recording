import { faker } from '@faker-js/faker'
import { PASSWORD_HASH_SALT } from '@identityModule/core/service/user-management.service'
import { User } from '@identityModule/persistence/entity/user.entity'
import { hashSync } from 'bcrypt'

import * as Factory from 'factory.ts'

export const userFactory = Factory.Sync.makeFactory<Partial<User>>({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: hashSync('password123', PASSWORD_HASH_SALT),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null
})
