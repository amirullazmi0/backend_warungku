import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CummonModule } from './cummon/cummon.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, CummonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
