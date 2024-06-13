import { BaseEntity, BaseEntityProps } from '@src/core/entity/base.entity'
import { randomUUID } from 'crypto'

export interface ThumbnailEntityProps extends BaseEntityProps {
  url: string
}

export class ThumbnailEntity extends BaseEntity {
  private url: ThumbnailEntityProps['url']

  private constructor(data: ThumbnailEntityProps) {
    super(data)
  }

  static createNew(
    data: Omit<ThumbnailEntityProps, 'id' | 'createdAt' | 'updatedAt'>,
    id = randomUUID()
  ): ThumbnailEntity {
    return new ThumbnailEntity({
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  static createFrom(data: ThumbnailEntityProps): ThumbnailEntity {
    return new ThumbnailEntity({
      id: data.id,
      url: data.url,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    })
  }

  getUrl(): ThumbnailEntityProps['url'] {
    return this.url
  }

  serialize() {
    return {
      id: this.id,
      url: this.url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
