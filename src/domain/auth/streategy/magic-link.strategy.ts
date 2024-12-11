import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import MagicLoginStrategy from 'passport-magic-login';
import { PrismaService } from 'src/database/database.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MagicLoginAuthStrategy extends PassportStrategy(
  MagicLoginStrategy,
  'magic-login',
) {
  constructor(private readonly prisma: PrismaService) {
    super({
      secret: process.env.JWT_SECRET, // Ensure this is set in your .env file
      callbackUrl: 'http://localhost:3000/auth/callback', // Update to your actual callback URL
      sendMagicLink: async (destination, href) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send the magic link
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: destination,
          subject: 'Your Magic Login Link',
          text: `Click here to login: ${href}`,
        });
      },

      verify: async (payload: any, done) => {
        try {
          console.log('Payload received:', payload);

          const email = payload.email || payload.destination; // Adjust based on the payload
          console.log('Email being used for query:', email);

          if (!email) {
            return done(
              new UnauthorizedException('Email not found in payload'),
              null,
            );
          }

          const user = await this.prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return done(new UnauthorizedException('User not found'), null);
          }

          return done(null, user);
        } catch (error) {
          console.error('Error in MagicLogin strategy:', error);
          return done(error, null);
        }
      },
    });
  }
}
