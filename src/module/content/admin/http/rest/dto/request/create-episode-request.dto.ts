import { IsNotEmpty, IsString } from 'class-validator'

export class CreateEpisodeRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string

  @IsNotEmpty()
  readonly season: number

  @IsNotEmpty()
  readonly number: number

  @IsString()
  readonly description: string
}
