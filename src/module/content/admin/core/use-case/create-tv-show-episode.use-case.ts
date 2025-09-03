import { ContentDistributionService } from '@contentModule/admin/core/service/content-distribution.service'
import { EpisodeLifecycleService } from '@contentModule/admin/core/service/episode-lifecycle.service'
import { VideoProcessorService } from '@contentModule/admin/core/service/video-processor.service'
import { CreateEpisodeRequestDto } from '@contentModule/admin/http/rest/dto/request/create-episode-request.dto'
import { ContentRepository } from '@contentModule/admin/persistence/repository/content.repository'
import { EpisodeRepository } from '@contentModule/admin/persistence/repository/episode.repository'
import { Episode } from '@contentModule/shared/persistence/entity/episode.entity'
import { Video } from '@contentModule/shared/persistence/entity/video.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { AppLogger } from '@sharedModules/logger/service/app-logger.service'
import { runInTransaction } from 'typeorm-transactional'

@Injectable()
export class CreateTvShowEpisodeUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly episodeLifecycleService: EpisodeLifecycleService,
    private readonly videoProcessorService: VideoProcessorService,
    private readonly episodeRepository: EpisodeRepository,
    private readonly contentDistributionService: ContentDistributionService,
    private readonly logger: AppLogger
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

    episode.video = video
    await runInTransaction(
      async () => {
        await this.contentRepository.saveTvShow(content)

        const savedEpisode = await this.episodeRepository.save(episode)
        //If it fails the transaction is rolled back
        this.logger.log(
          `Episode ${savedEpisode.title} with id ${savedEpisode.id} created`,
          {
            content,
            savedEpisode
          }
        )
        return savedEpisode
      },
      {
        connectionName: 'content'
      }
    )
    await this.videoProcessorService.processMetadataAndModeration(video)
    await this.contentDistributionService.distributeContent(content.id)

    return episode
  }
}
