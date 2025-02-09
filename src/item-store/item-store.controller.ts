import { Controller, Get, Query } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { user } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { apiUser } from 'src/common/url';

@Controller(`${apiUser}/item-store`)
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) { }

  @Get()
  async getAll(
    @Auth() user: user,
    @Query('id') id?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string | string[]
  ) {

    const categoryIds = Array.isArray(category) ? category : category?.split(',');

    return this.itemStoreService.getDataItemStore(id, user, keyword, categoryIds);
  }

  @Get('category')
  async getCategory(
    @Auth() user: user
  ) {
    return this.itemStoreService.getCategory()
  }
}
