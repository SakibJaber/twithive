import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env.dev'],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`.trim(),
      // load: [appConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
    }),
    DomainModule,
    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
