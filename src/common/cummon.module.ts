import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthUserMidlleware } from './auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AttachmentService } from 'src/attachment/attachment.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from 'src/auth/token-cleanup.service';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public'),
      exclude: ['/api/(.*)'],
    }),
    JwtModule.register({
      global: true,
      secret: 'mysecret-warungku-bosdannis',
      //   signOptions: {
      //     expiresIn: '1h',
      //   },
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [PrismaService, AttachmentService, TokenCleanupService],
  exports: [PrismaService, AttachmentService, TokenCleanupService],
})
export class CummonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserMidlleware).forRoutes('/api/*');
  }
}
