import { DefaultTypeOrmRepository } from '@sharedModules/persistence/typeorm/repository/default-typeorm.repository'
import { Episode } from '@contentModule/persistence/entity/episode.entity'
import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class EpisodeRepository extends DefaultTypeOrmRepository<Episode> {
  constructor(@Inject(DataSource) readonly dataSource: DataSource) {
    super(Episode, dataSource)
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
