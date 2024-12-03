import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { TweetModule } from './tweet/tweet.module';

@Module({
  imports: [DatabaseModule, UsersModule, TweetModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
