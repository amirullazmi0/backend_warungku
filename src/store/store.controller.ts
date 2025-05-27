import { Controller, Get, Param } from '@nestjs/common';
import { user } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { apiUser } from 'src/common/url';
import { StoreService } from './store.service';

@Controller(`${apiUser}/store`)
export class StoreController {
  constructor(private storeService: StoreService) {}
  @Get(':id?')
  async getDataStore(@Auth() user: user, @Param('id') id: string) {
    return await this.storeService.getDataStore(id);
  }

  @Get(':id/item')
  async getDataItemStore(@Auth() user: user, @Param('id') id: string) {
    return await this.storeService.getDataItemStore(id, user);
  }
}
