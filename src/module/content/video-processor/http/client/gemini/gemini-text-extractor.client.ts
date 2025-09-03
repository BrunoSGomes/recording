import {
  AgeRecommendationSchema,
  VideoAgeRecommendationAdapter
} from '@contentModule/video-processor/core/adapter/video-recommendation.adapter.interface'
import { VideoSummaryGenerationAdapter } from '@contentModule/video-processor/core/adapter/video-summary-generator.adapter.interface'
import { VideoTranscriptGenerationAdapter } from '@contentModule/video-processor/core/adapter/video-transcript-generator.adapter.interface'
import { GoogleGenAI, Type } from '@google/genai'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@sharedModules/config/service/config.service'

import * as fs from 'node:fs'

const defaultResponseSchema = {
  type: Type.OBJECT,
  properties: {
    responseText: { type: Type.STRING }
  }
}

@Injectable()
export class GeminiTextExtractorClient
  implements
    VideoSummaryGenerationAdapter,
    VideoTranscriptGenerationAdapter,
    VideoAgeRecommendationAdapter
{
  constructor(private readonly configService: ConfigService) {}
  async generateSummary(videoUrl: string): Promise<string | undefined> {
    const response = await this.performRequest<{
      responseText: string
    }>(videoUrl, 'Please summarize the video in 3 sentences.')
    return response.responseText
  }

  async generateTranscript(videoUrl: string): Promise<string | undefined> {
    const response = await this.performRequest<{
      responseText: string
    }>(
      videoUrl,
      'Please generate a transcript of the video. Please include the speaker names and timestamps.'
    )
    return response.responseText
  }

  async getAgeRecommendation(
    videoUrl: string
  ): Promise<AgeRecommendationSchema | undefined> {
    const response = await this.performRequest<{
      ageRating: number
      explanation: string
      categories: string[]
    }>(
      videoUrl,
      'Please analyze this video and provide: an integer "ageRating" between 0-18, an "explanation" of why this rating is appropriate, and a "categories" array with content categories (violence, language, etc). Return results in JSON format matching the defined schema.',
      {
        type: Type.OBJECT,
        properties: {
          ageRating: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          categories: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    )

    return response
  }

  private async performRequest<T>(
    videoUrl: string,
    prompt: string,
    responseSchema: Record<string, unknown> = defaultResponseSchema
  ): Promise<T> {
    const ai = new GoogleGenAI({
      apiKey: this.configService.get('geminiApi.apiKey')
    })

    //max 20mb
    const base64VideoFile = fs.readFileSync(videoUrl, {
      encoding: 'base64'
    })

    const contents = [
      {
        inlineData: {
          mimeType: 'video/mp4',
          data: base64VideoFile
        }
      },
      { text: prompt }
    ]

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema
      }
    })
    if (result.text) {
      return JSON.parse(result.text)
    }
    throw new Error('No response text found')
  }
}
