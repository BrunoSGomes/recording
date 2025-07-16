import { SubscriptionStatus } from '@billingModule/core/enum/subscription-status.enum'
import { DefaultResponseDto } from '@billingModule/http/rest/dto/response/default-response.dto'
import { Expose } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID
} from 'class-validator'

export class SubscriptionResponseDto extends DefaultResponseDto {
  @IsUUID(4)
  @Expose()
  @IsNotEmpty()
  readonly userId: string

  @IsUUID(4)
  @Expose()
  @IsNotEmpty()
  readonly planId: string

  @IsEnum(SubscriptionStatus)
  @Expose()
  @IsNotEmpty()
  readonly status: SubscriptionStatus

  @IsDateString()
  @Expose()
  @IsNotEmpty()
  readonly startDate: Date

  @IsDateString()
  @Expose()
  @IsOptional()
  readonly endDate: Date | null

  @IsBoolean()
  @Expose()
  @IsNotEmpty()
  readonly autoRenew: boolean
}
