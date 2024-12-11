import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/database.service';
import { MagicLoginAuthStrategy } from './streategy/magic-link.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'magic-login' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MagicLoginAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
