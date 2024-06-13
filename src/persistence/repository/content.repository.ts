import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ContentEntity } from '@src/core/entity/content.entity'
import { PrismaService } from '@src/persistence/prisma/prisma.service'

@Injectable()
export class ContentRepository {
  private readonly model: PrismaService['content']

  constructor(private readonly prismaService: PrismaService) {
    this.model = prismaService.content
  }

  async create(content: ContentEntity): Promise<ContentEntity> {
    try {
      const movie = content.getMedia()
      if (!movie) {
        throw new Error('Movie must be provided')
      }
      const video = movie.getVideo()

      await this.model.create({
        data: {
          id: content.getId(),
          title: content.getTitle(),
          description: content.getDescription(),
          type: content.getType(),
          createdAt: content.getCreatedAt(),
          updatedAt: content.getUpdatedAt(),
          Movie: {
            create: {
              id: movie.getId(),
              Video: {
                create: video.serialize()
              },
              Thumbnail: {
                create: movie.getThumbnail()?.serialize()
              }
            }
          }
        }
      })

      return content
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message
    }

    return 'An unexpected error occurred.'
  }

  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error)
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(error.message)
    }

    throw new Error(errorMessage)
  }
}
