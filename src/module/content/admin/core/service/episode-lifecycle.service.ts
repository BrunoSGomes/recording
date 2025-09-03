import { EpisodeRepository } from '@contentModule/admin/persistence/repository/episode.repository'
import { Episode } from '@contentModule/shared/persistence/entity/episode.entity'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class EpisodeLifecycleService {
  constructor(private readonly episodeRepository: EpisodeRepository) {}

  async checkEpisodeConstraintsOrThrow(episode: Episode) {
    //Domain logic validation
    const episodeWithSameSeasonAndNumber =
      await this.episodeRepository.existsBy({
        season: episode.season,
        number: episode.number,
        tvShowId: episode.tvShow.id
      })
    if (episodeWithSameSeasonAndNumber) {
      //this is not a domain exception
      throw new BadRequestException(
        `Episode with season ${episode.season} and number ${episode.number} already exists`
      )
    }

    const lastEpisode =
      await this.episodeRepository.findByLastEpisodeByTvShowAndSeason(
        episode.tvShow.id,
        episode.season
      )
    if (lastEpisode && lastEpisode.number + 1 !== episode.number) {
      throw new BadRequestException(
        `Episode number should be ${lastEpisode.number + 1}`
      )
    }
  }
}
