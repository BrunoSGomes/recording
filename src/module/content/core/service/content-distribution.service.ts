import { Injectable } from '@nestjs/common'

@Injectable()
export class ContentDistributionService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async distributeContent(_contentId: string) {
    return 'started'
  }
}
