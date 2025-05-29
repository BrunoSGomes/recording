import { Injectable } from '@nestjs/common'

@Injectable()
export class VideoMetadataService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getVideoDurantaion(_videoPath: string): Promise<number> {
    // This is a placeholder for the actual implementation
    return 100
  }
}
