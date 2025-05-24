import { Expose } from 'class-transformer'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class UserSubscriptionActiveResponseDto {
  @IsBoolean()
  @Expose()
  @IsNotEmpty()
  readonly isActive: boolean
}
