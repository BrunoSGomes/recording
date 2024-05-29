import { Injectable } from '@nestjs/common'
import { PrismaService } from '@src/persistence/prisma/prisma.service'

@Injectable()
export class PrepareStreamingUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  public async execute(id: string) {
    return this.prismaService.video.findUnique({
      where: { id }
    })
  }
}
