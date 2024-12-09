import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';

@Module({
  imports: [],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule {}
