export interface VideoSummaryGenerationAdapter {
  generateSummary(videoUrl: string): Promise<string | undefined>
}

export const VideoSummaryGenerationAdapter = Symbol(
  'VideoSummaryGenerationAdapter'
)
