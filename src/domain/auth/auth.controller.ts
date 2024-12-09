import { Controller, Post, Query, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-link')
  async sendLoginLink(@Body('email') email: string) {
    return this.authService.sendLoginLink(email);
  }

  @Post('login')
  async loginWithToken(@Query('token') token: string) {
    const user = await this.authService.validateToken(token);
    // Here, you can generate and return a JWT or session token
    return { message: 'Login successful', user };
  }
}







