import { Module } from '@nestjs/common';
import { ItemStoreController } from './item-store.controller';
import { ItemStoreService } from './item-store.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ItemStoreController],
  providers: [ItemStoreService, PrismaService]
})
export class ItemStoreModule { }
