import { DynamicModule, Module } from '@nestjs/common'
import { Content } from './entity/content.entity'
import { Episode } from './entity/episode.entity'
import { Movie } from './entity/movie.entity'
import { Thumbnail } from './entity/thumbnail.entity'
import { TvShow } from './entity/tv-show.entity'
import { Video } from './entity/video.entity'
import { ContentRepository } from './repository/content.repository'
import { MovieRepository } from './repository/movie.repository'
import { VideoRepository } from './repository/video.repository'
import { TypeOrmPersistenceModule } from '@contentModule/infra/module/typeorm/typeorm-persistence.module'

@Module({})
export class PersistenceModule {
  static forRoot(opts?: { migrations?: string[] }): DynamicModule {
    const { migrations } = opts || {}
    return {
      module: PersistenceModule,
      imports: [
        TypeOrmPersistenceModule.forRoot({
          migrations,
          entities: [Content, Movie, Thumbnail, Video, TvShow, Episode]
        })
      ],
      providers: [ContentRepository, MovieRepository, VideoRepository],
      exports: [ContentRepository, MovieRepository, VideoRepository]
    }
  }
}
