import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { AuthSuper } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { storeUpdatePasswordRequest } from 'model/store.model';

@Controller('/api/store')
export class StoreController {
    constructor(
        private storeService: StoreService
    ) { }

    @Get()
    async getAll(
        @AuthSuper() user: user,
        @Query('id') id?: string,
    ) {
        return this.storeService.getData(id);
    }

    @Put('/:id/update-password')
    async updatePasswordById(
        @AuthSuper() user: user,
        @Query('id') id: string,
        @Body() req: storeUpdatePasswordRequest
    ) {
        return this.storeService.updatePasswordById(id, req);
    }

    @Delete('/:id/delete')
    async deleteStoreById(
        @AuthSuper() user: user,
        @Query('id') id: string,
        @Body() req: storeUpdatePasswordRequest
    ) {
        return this.storeService.updatePasswordById(id, req);
    }
}
