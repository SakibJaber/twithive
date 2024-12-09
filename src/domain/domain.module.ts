import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { TweetModule } from './tweet/tweet.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule,AuthModule, UsersModule, TweetModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
