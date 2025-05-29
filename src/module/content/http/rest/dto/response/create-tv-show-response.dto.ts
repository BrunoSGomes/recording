import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateTvShowResponseDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string
  @IsUUID()
  @IsNotEmpty()
  readonly tvShowId: string
  @IsString()
  @IsNotEmpty()
  readonly title: string
  @IsString()
  @IsNotEmpty()
  readonly description: string
  @IsString()
  readonly thumbnailUrl?: string
}
