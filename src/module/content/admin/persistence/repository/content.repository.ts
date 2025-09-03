import { MovieContentModel } from '@contentModule/admin/core/model/movie-content.model'
import { TvShowContentModel } from '@contentModule/admin/core/model/tv-show-content.model'
import { ContentType } from '@contentModule/shared/core/enum/content-type.enum'
import { Content } from '@contentModule/shared/persistence/entity/content.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class ContentRepository extends DefaultTypeOrmRepository<Content> {
  constructor(
    @InjectDataSource('content')
    dataSource: DataSource
  ) {
    super(Content, dataSource.manager)
  }

  async saveMovieOrTvShow(entity: MovieContentModel): Promise<MovieContentModel>
  async saveMovieOrTvShow(
    entity: TvShowContentModel
  ): Promise<TvShowContentModel>
  async saveMovieOrTvShow(
    entity: MovieContentModel | TvShowContentModel
  ): Promise<MovieContentModel | TvShowContentModel>
  async saveMovieOrTvShow(
    entity: MovieContentModel | TvShowContentModel
  ): Promise<MovieContentModel | TvShowContentModel> {
    if (entity.type === ContentType.MOVIE) {
      return this.saveMovie(entity as MovieContentModel)
    }
    if (entity.type === ContentType.TV_SHOW) {
      return this.saveTvShow(entity as TvShowContentModel)
    }
    throw new Error(`Content type ${entity.type} not found`)
  }

  async saveMovie(entity: MovieContentModel): Promise<MovieContentModel> {
    const content = new Content({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      ageRecommendation: entity.ageRecommendation,
      type: entity.type,
      movie: entity.movie
    })
    await super.save(content)

    return this.mapToMovieContentModel(content)
  }

  async saveTvShow(entity: TvShowContentModel): Promise<TvShowContentModel> {
    const content = new Content({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      ageRecommendation: entity.ageRecommendation,
      tvShow: entity.tvShow
    })
    await super.save(content)

    return this.mapToTvShowContentModel(content)
  }

  async findTvShowContentById(
    id: string,
    relations: string[]
  ): Promise<TvShowContentModel | null> {
    const content = await super.findOneById(id, relations)

    //Ensure the content is the type tvShow
    if (!content || !content.tvShow) {
      return null
    }

    return this.mapToTvShowContentModel(content)
  }

  async findContentByVideoId(
    videoId: string
  ): Promise<TvShowContentModel | MovieContentModel | null> {
    const content = await this.entityManager
      .createQueryBuilder(Content, 'content')
      .leftJoinAndSelect('content.movie', 'movie')
      .leftJoinAndSelect('movie.video', 'movieVideo')
      .leftJoinAndSelect('content.tvShow', 'tvShow')
      .leftJoinAndSelect('tvShow.episodes', 'episode')
      .leftJoinAndSelect('episode.video', 'episodeVideo')
      .where('movieVideo.id = :videoId OR episodeVideo.id = :videoId', {
        videoId
      })
      .getOne()

    if (!content || (!content.movie && !content.tvShow)) {
      return null
    }
    if (content.tvShow) {
      return this.mapToTvShowContentModel(content)
    }
    if (content.movie) {
      return this.mapToMovieContentModel(content)
    }
    return null
  }

  private mapToMovieContentModel(content: Content): MovieContentModel {
    return new MovieContentModel({
      id: content.id,
      title: content.title,
      description: content.description,
      ageRecommendation: content.ageRecommendation,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
      movie: content.movie!
    })
  }
  private mapToTvShowContentModel(content: Content): TvShowContentModel {
    return new TvShowContentModel({
      id: content.id,
      title: content.title,
      description: content.description,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
      tvShow: content.tvShow!
    })
  }
}
