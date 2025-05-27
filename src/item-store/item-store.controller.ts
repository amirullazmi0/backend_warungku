import { Controller, Get, Query } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { user } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { apiUser } from 'src/common/url';
import { unAuthorized } from 'DTO/message';
import { HttpStatusCode } from 'axios';

@Controller(`${apiUser}/item-store`)
export class ItemStoreController {
  constructor(private itemStoreService: ItemStoreService) {}

  @Get()
  async getAll(
    @Auth() user: user,
    @Query('id') id?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string | string[],
  ) {
    const categoryIds = Array.isArray(category)
      ? category
      : category?.split(',');

    if (!user) {
      return {
        statusCode: HttpStatusCode.Unauthorized,
        message: unAuthorized,
      };
    }

    return this.itemStoreService.getDataItemStore(
      id,
      user,
      keyword,
      categoryIds,
    );
  }

  @Get('category')
  async getCategory(@Auth() user: user) {
    if (!user) {
      return {
        statusCode: HttpStatusCode.Unauthorized,
        message: unAuthorized,
      };
    }
    return this.itemStoreService.getCategory();
  }
}
