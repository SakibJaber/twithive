import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateTweetDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Impressions must be a non-negative number' })
  impression?: number;
}
