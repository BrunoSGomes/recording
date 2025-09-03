import { Video } from '@contentModule/shared/persistence/entity/video.entity'
import { faker } from '@faker-js/faker/.'

import * as Factory from 'factory.ts'

export const videoFactory = Factory.Sync.makeFactory<Partial<Video>>({
  id: faker.string.uuid(),
  url: faker.internet.url(),
  sizeInKb: faker.number.int({ min: 1000, max: 10000 }),
  duration: faker.number.int({ min: 100, max: 10000 }),
  movieId: null,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  deletedAt: null
})
