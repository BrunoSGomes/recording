import { Video } from '@contentModule/persistence/entity/video.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class VideoProfanityFilterService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async filterProfanity(_video: Video) {
    return 'profanity-filtered'
  }
}
