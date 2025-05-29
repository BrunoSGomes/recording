import { Injectable } from '@nestjs/common'

@Injectable()
export class AgeRecommendationService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAgeRecommendationForContent(_videoUrl: string): Promise<number> {
    return await 5
  }
}
