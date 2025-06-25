import { Episode } from '@contentModule/persistence/entity/episode.entity'
import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { DataSource } from 'typeorm'

@Injectable()
export class EpisodeRepository extends DefaultTypeOrmRepository<Episode> {
  constructor(
    @InjectDataSource()
    dataSource: DataSource
  ) {
    super(Episode, dataSource.manager)
  }

  async findByLastEpisodeByTvShowAndSeason(
    tvShowId: string,
    season: number
  ): Promise<Episode | null> {
    return this.find({
      where: {
        tvShowId,
        season
      },
      order: {
        number: 'DESC'
      }
    })
  }
}
