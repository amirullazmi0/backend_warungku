import { Controller, Get, Query } from '@nestjs/common';
import { ItemStoreService } from './item-store.service';
import { apiUser } from 'src/cummon/url';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller(`${apiUser}/item-store`)
export class ItemStoreController {
    constructor(
        private itemStoreService: ItemStoreService
    ) { }

    @Get()
    async getAll(
        @Auth() user: user,
        @Query('id') id?: string
    ) {
        return this.itemStoreService.getDataItemStore(id)
    }
}
