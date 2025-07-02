export interface VideoTranscriptGenerationAdapter {
  generateTranscript(videoUrl: string): Promise<string | undefined>
}

export const VideoTranscriptGenerationAdapter = Symbol(
  'VideoTranscriptGenerationAdapter'
)
