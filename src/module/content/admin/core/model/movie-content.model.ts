import { ContentType } from '@contentModule/shared/core/enum/content-type.enum'
import { Movie } from '@contentModule/shared/persistence/entity/movie.entity'
import { WithOptional } from '@sharedLibs/core/model/default.model'
import { randomUUID } from 'crypto'

export class MovieContentModel {
  id: string
  title: string
  description: string
  type: ContentType
  movie: Movie
  ageRecommendation: number | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor(
    data: Omit<
      WithOptional<
        MovieContentModel,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
      >,
      'type'
    >
  ) {
    Object.assign(this, {
      ...data,
      id: data.id ? data.id : randomUUID(),
      //encapsulates the creation
      type: ContentType.MOVIE,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      deletedAt: data.deletedAt,
      movie: data.movie
    })
  }
}
