import { Module } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { ItemStoreController } from './item-store.controller';

@Module({
  providers: [ItemStoreService],
  controllers: [ItemStoreController]
})
export class ItemStoreModule {}
