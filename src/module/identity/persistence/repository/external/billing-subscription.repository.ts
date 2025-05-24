import { Injectable } from '@nestjs/common'
import { BillingSubscriptionStatusApi } from '@sharedModules/integration/interface/billing-integration.interface'
import { DefaultPrismaRepository } from '@sharedModules/persistence/prisma/default.prisma.repository'
import { PrismaService } from '@sharedModules/persistence/prisma/prisma.service'

@Injectable()
export class BillingSubscriptionRepository
  extends DefaultPrismaRepository
  implements BillingSubscriptionStatusApi
{
  private readonly model: PrismaService['subscription']
  constructor(prismaService: PrismaService) {
    super()
    this.model = prismaService.subscription
  }
  async isUserSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const subscription = await this.model.findFirst({
        where: {
          userId,
          status: 'ACTIVE' //use a proper type
        }
      })
      return !!subscription
    } catch (error) {
      this.handleAndThrowError(error)
    }
  }
}
