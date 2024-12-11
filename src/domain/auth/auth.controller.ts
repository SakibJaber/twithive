// import { Controller, Post, Query, Body } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('send-link')
//   async sendLoginLink(@Body('email') email: string) {
//     return this.authService.sendLoginLink(email);
//   }

//   @Post('login')
//   async loginWithToken(@Query('token') token: string) {
//     const user = await this.authService.validateToken(token);
//     // Here, you can generate and return a JWT or session token
//     return { message: 'Login successful', user };
//   }
// }

import { Controller, Post, Body, Req, UseGuards, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-link')
  async sendLink(@Body('email') email: string) {
    await this.authService.sendLoginLink(email);
    return { message: 'Magic login link sent to your email.' };
  }

  @Get('callback')
  @UseGuards(AuthGuard('magic-login'))
  async callback(@Req() req) {
    const user = req.user;
    return { message: 'Login successful', user };
  }

  @Post('validate')
  async validateToken(@Query('token') token: string) {
    const user = await this.authService.validateToken(token);
    return { message: 'Login successful', user };
  }
}
