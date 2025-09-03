import { TvShow } from '@contentModule/shared/persistence/entity/tv-show.entity'
import { faker } from '@faker-js/faker'

import * as Factory from 'factory.ts'

export const tvShowFactory = Factory.Sync.makeFactory<Partial<TvShow>>({
  id: faker.string.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  contentId: faker.string.uuid(),
  deletedAt: null
})
