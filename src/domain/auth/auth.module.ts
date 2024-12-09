import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/database.service';


@Module({
  imports: [

  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ],
})
export class AuthModule {}
