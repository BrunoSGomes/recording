import { Injectable } from '@nestjs/common'
import { ContentEntity, ContentType } from '../entity/content.entity'
import { MovieEntity } from '../entity/movie.entity'
import { VideoEntity } from '../entity/video.entity'
import { ThumbnailEntity } from '../entity/thumbnail.entity'
import { ContentRepository } from '@src/persistence/repository/content.repository'

export interface CreateContentData {
  title: string
  description: string
  url: string
  thumbnailUrl: string
  sizeInKb: number
}

@Injectable()
export class ContentManagementService {
  constructor(private readonly contentRepository: ContentRepository) {}

  public async createContent(createContentData: CreateContentData) {
    const content = ContentEntity.createNew({
      title: createContentData.title,
      description: createContentData.description,
      type: ContentType.MOVIE,
      media: MovieEntity.createNew({
        video: VideoEntity.createNew({
          url: createContentData.url,
          sizeInKb: createContentData.sizeInKb,
          duration: 100
        }),
        thumbnail: ThumbnailEntity.createNew({
          url: createContentData.thumbnailUrl
        })
      })
    })
    await this.contentRepository.create(content)
    return content
  }
}
