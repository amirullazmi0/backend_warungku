import {
  Controller,
  Get,
  // , Query
} from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { apiStore } from 'src/common/url';
// import { Auth } from 'src/common/auth.decorator';
// import { user } from '@prisma/client';

@Controller(`${apiStore}/item-store`)
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) {}

  @Get()
  async getAll() {
    return this.itemStoreService.getDataItemStore();
  }
}
