import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('/api/store')
export class StoreController {
    constructor(
        private storeService: StoreService
    ) { }

    @Get()
    async getAll(
        @Query('id') id?: string,
    ) {
        return this.storeService.getData(id);
    }
}
