import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}

