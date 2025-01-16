import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, AuthService],
  imports: [AuthModule, PrismaModule],
})
export class PaymentModule {}
