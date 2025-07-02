import { AgeRecommendationService } from '@contentModule/core/service/age-recommendation.service'
import { ContentDistributionService } from '@contentModule/core/service/content-distribution.service'
import { EpisodeLifecycleService } from '@contentModule/core/service/episode-lifecycle.service'
import { VideoProcessorService } from '@contentModule/core/service/video-processor.service'
import { CreateEpisodeRequestDto } from '@contentModule/http/rest/dto/request/create-episode-request.dto'
import { Episode } from '@contentModule/persistence/entity/episode.entity'
import { Video } from '@contentModule/persistence/entity/video.entity'
import { ContentRepository } from '@contentModule/persistence/repository/content.repository'
import { EpisodeRepository } from '@contentModule/persistence/repository/episode.repository'
import { Injectable, NotFoundException } from '@nestjs/common'
import { runInTransaction } from 'typeorm-transactional'

@Injectable()
export class CreateTvShowEpisodeUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly ageRecommendationService: AgeRecommendationService,
    private readonly episodeLifecycleService: EpisodeLifecycleService,
    private readonly videoProcessorService: VideoProcessorService,
    private readonly episodeRepository: EpisodeRepository,
    private readonly contentDistributionService: ContentDistributionService
  ) {}

  async execute(
    episodeData: CreateEpisodeRequestDto & {
      videoUrl: string
      contentId: string
      videoSizeInKb: number
    }
  ): Promise<Episode> {
    const content = await this.contentRepository.findTvShowContentById(
      episodeData.contentId,
      ['tvShow']
    )
    if (!content?.tvShow) {
      throw new NotFoundException(
        `TV Show with id ${episodeData.contentId} not found`
      )
    }
    //!Episode cannot be loaded with tvShow because of the number of records
    //Episode can only be loaded if video is ready
    const episode = new Episode({
      title: episodeData.title,
      description: episodeData.description,
      season: episodeData.season,
      number: episodeData.number,
      tvShow: content.tvShow
    })

    //start passing the entity
    await this.episodeLifecycleService.checkEpisodeConstraintsOrThrow(episode)

    //TODO add status to the video
    const video = new Video({
      url: episodeData.videoUrl,
      sizeInKb: episodeData.videoSizeInKb
    })

    Promise.all([
      await this.videoProcessorService.processMetadataAndModeration(video),
      await this.ageRecommendationService.setAgeRecommendationForContent(
        content
      )
    ])

    episode.video = video
    return await runInTransaction(async () => {
      await this.contentRepository.saveTvShow(content)

      const savedEpisode = await this.episodeRepository.save(episode)
      //If it fails the transaction is rolled back
      await this.contentDistributionService.distributeContent(content.id)
      return savedEpisode
    })
  }
}
