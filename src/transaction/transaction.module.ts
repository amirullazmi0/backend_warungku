import { Module } from '@nestjs/common';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService],
  imports: [AuthModule],
})
export class TransactionModule {}
