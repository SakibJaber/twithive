import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/database/database.service';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async sendLoginLink(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m', // Token expiration (15 minutes)
    });
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.prisma.token.create({
      data: {
        type: 'passwordless_login',
        emailToken: token,
        expiration,
        userId: user.id,
      },
    });

    const loginUrl = `http://localhost:3000/auth/callback?token=${token}`;
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
      subject: 'Magic Login Link',
      text: `Click here to login: ${loginUrl}`,
    });
  }

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or user does not exist');
    }
    // Optionally, exclude sensitive fields before returning
    const { password, ...result } = user;
    return result;
  }

  async validateToken(token: string) {
    try {
      // Decode the JWT token
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        email: string;
        userId: number;
      };

      // Retrieve the corresponding token from the database
      const tokenRecord = await this.prisma.token.findUnique({
        where: { emailToken: token },
      });

      if (
        !tokenRecord ||
        !tokenRecord.valid ||
        tokenRecord.expiration < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Invalidate the token after successful use
      await this.prisma.token.update({
        where: { id: tokenRecord.id },
        data: { valid: false },
      });

      // Retrieve the user associated with the token
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
