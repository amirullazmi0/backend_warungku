import { Controller, Get } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { apiStore } from 'src/common/url';

@Controller(`${apiStore}/item-store`)
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) {}

  @Get()
  async getAll() {
    return this.itemStoreService.getDataItemStore();
  }
}
