export interface AgeRecommendationSchema {
  ageRating: number
  explanation: string
  categories: string[]
}
export interface VideoAgeRecommendationAdapter {
  getAgeRecommendation(
    videoUrl: string
  ): Promise<AgeRecommendationSchema | undefined>
}

export const VideoAgeRecommendationAdapter = Symbol(
  'VideoAgeRecommendationAdapter'
)
