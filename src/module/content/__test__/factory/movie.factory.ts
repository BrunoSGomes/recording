import { Movie } from '@contentModule/shared/persistence/entity/movie.entity'
import { faker } from '@faker-js/faker/.'

import * as Factory from 'factory.ts'

export const movieFactory = Factory.Sync.makeFactory<Partial<Movie>>({
  id: faker.string.uuid(),
  externalRating: faker.number.float({ min: 0, max: 10 }),
  contentId: faker.string.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null
})
