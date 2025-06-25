import { MovieContentModel } from '@contentModule/core/model/movie-content.model'
import { TvShowContentModel } from '@contentModule/core/model/tv-show-content.model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AgeRecommendationService {
  async setAgeRecommendationForContent(
    content: TvShowContentModel | MovieContentModel
  ): Promise<void> {
    content.ageRecommendation = 18
  }
}
