import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post
} from '@nestjs/common'
import { NotFoundDomainException } from '@sharedLibs/core/exeption/not-found-domain.exception'
import { SubscriptionService } from '@billingModule/core/service/subscription.service'
import { CreateSubscriptionRequestDto } from '@billingModule/http/rest/dto/request/create-subscription.dto'
import { SubscriptionResponseDto } from '@billingModule/http/rest/dto/response/subscription-response.dto'
import { plainToInstance } from 'class-transformer'
import { UserSubscriptionActiveResponseDto } from '@billingModule/http/rest/dto/response/user-subscription-active-response.dto'

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(
    @Body() createSubscriptionRequest: CreateSubscriptionRequestDto
  ): Promise<SubscriptionResponseDto> {
    try {
      const createdSubscription =
        await this.subscriptionService.createSubscription(
          createSubscriptionRequest
        )
      //TODO validate
      return plainToInstance(
        SubscriptionResponseDto,
        { ...createdSubscription, ...{ plan: createdSubscription.Plan } },
        {
          excludeExtraneousValues: true
        }
      )
    } catch (error) {
      if (error instanceof NotFoundDomainException) {
        throw new NotFoundException(error.message)
      }
      console.error('Error creating subscription', error)
      throw new InternalServerErrorException()
    }
  }

  @Get('/user/:userId/active')
  async isUserSubscriptionActive(
    userId: string
  ): Promise<UserSubscriptionActiveResponseDto> {
    const isActive = this.subscriptionService.isUserSubscriptionActive(userId)
    return plainToInstance(
      UserSubscriptionActiveResponseDto,
      { isActive },
      {
        excludeExtraneousValues: true
      }
    )
  }
}
