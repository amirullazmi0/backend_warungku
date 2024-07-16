import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { AuthSuper } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { storeUpdatePasswordRequest } from 'model/store.model';
import { apiUser } from 'src/cummon/url';

@Controller()
export class StoreController {
    constructor(
        private storeService: StoreService
    ) { }

    @Get(`${apiUser}/get-store`)
    async getAll(
        @AuthSuper() user: user,
        @Query('id') id?: string,
    ) {
        return this.storeService.getData(id);
    }
}
