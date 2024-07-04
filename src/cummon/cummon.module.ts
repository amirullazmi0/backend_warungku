import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthUserMidlleware } from './auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'mysecret-warungku-bosdannis',
      //   signOptions: {
      //     expiresIn: '1h',
      //   },
    }),
    HttpModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CummonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMidlleware).forRoutes('/api/*');
  }
}
