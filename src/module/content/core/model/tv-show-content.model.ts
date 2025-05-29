import { ContentType } from '@contentModule/core/enum/content-type.enum'
import { TvShow } from '@contentModule/persistence/entity/tv-show.entity'
import { WithOptional } from '@sharedLibs/core/model/default.model'
import { randomUUID } from 'crypto'

export class TvShowContentModel {
  id: string
  title: string
  description: string
  type: ContentType
  tvShow: TvShow
  ageRecommendation: number | null
  releaseDate: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor(
    data: Omit<
      WithOptional<
        TvShowContentModel,
        | 'id'
        | 'createdAt'
        | 'updatedAt'
        | 'deletedAt'
        | 'ageRecommendation'
        | 'releaseDate'
      >,
      'type'
    >
  ) {
    Object.assign(this, {
      ...data,
      id: data.id ? data.id : randomUUID(),
      //encapsulates the creation
      type: ContentType.TV_SHOW,
      ageRecommendation: data.ageRecommendation || null,
      releaseDate: data.releaseDate || null,
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      deletedAt: data.deletedAt,
      tvShow: data.tvShow
    })
  }
}
