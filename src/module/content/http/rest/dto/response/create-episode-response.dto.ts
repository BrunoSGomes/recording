import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator'

export class CreateEpisodeResponseDto {
  @IsUUID()
  @IsNotEmpty()
  readonly id: string
  @IsString()
  @IsNotEmpty()
  readonly title: string
  @IsString()
  @IsNotEmpty()
  readonly description: string
  @IsString()
  @IsNotEmpty()
  readonly videoUrl: string

  @IsNumber()
  @IsNotEmpty()
  readonly sizeInKb: number
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  readonly duration: number | null
}
