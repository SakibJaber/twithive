import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async sendLoginLink(email: string) {
    // Find the user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate a secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 5 * 60 * 1000); // Token valid for 15 minutes

    // Save the token in the database
    await this.prisma.token.create({
      data: {
        type: 'passwordless_login',
        emailToken: token,
        expiration,
        userId: user.id,
      },
    });

    const loginUrl = `http://localhost:3000/auth/login?token=${token}`;

    // Send the login email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'techandtech360@gmail.com',
        pass: 'ozlp ycly mnxf bdws',
      },
    });

    await transporter.sendMail({
      from: 'techandtech360@gmail.com',
      to: email,
      subject: 'Your Login Link',
      text: `Click the link to log in: ${loginUrl}`,
    });

    return { message: 'Login link sent successfully' };
  }

  async validateToken(token: string) {
    // Find the token record
    const tokenRecord = await this.prisma.token.findUnique({ where: { emailToken: token } });

    if (!tokenRecord || !tokenRecord.valid || tokenRecord.expiration < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Mark the token as used
    await this.prisma.token.update({
      where: { id: tokenRecord.id },
      data: { valid: false },
    });

    // Retrieve the associated user
    const user = await this.prisma.user.findUnique({ where: { id: tokenRecord.userId } });

    return user;
  }

  
  
}
