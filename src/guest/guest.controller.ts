import { Controller, Get, Query } from '@nestjs/common';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(
    private guestService: GuestService
  ) { }

  @Get('/item-store')
  async getGuestAll(
    @Query('id') id?: string,
    @Query('keyword') keyword?: string,
    @Query('category') category?: string | string[],
  ) {
    const categoryIds = Array.isArray(category)
      ? category
      : category?.split(',');

    return this.guestService.getDataItemStoreGuest(
      id,
      keyword,
      categoryIds,
    );
  }

  @Get('/item-store/category')
  async getGuestCategory() {
    return this.guestService.getCategory();
  }
}
