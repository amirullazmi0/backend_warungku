import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { user } from '@prisma/client';
import { Auth } from 'src/common/auth.decorator';
import { apiUser } from 'src/common/url';
import { wishlistRequest } from './dto';
import { WishlistService } from './wishlist.service';
import { audit } from 'rxjs';

@Controller(`${apiUser}/wishlist`)
export class WishlistController {
    constructor(
        private wishlistService: WishlistService
    ) { }

    @Get()
    async getData(
        @Auth() user: user,
    ) {
        return await this.wishlistService.getDataWishlist(user)
    }

    @Post()
    async updateWishlist(
        @Auth() user: user,
        @Body() body: wishlistRequest
    ) {
        return await this.wishlistService.updateDataWishlist(user, body)
    }
}
