import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { wishlistRequest, wishlistResponse } from './dto';
import { deleteDataSuccess, getDataSuccess, postDataSuccess, updateDataSuccess } from 'DTO/message';
import { user } from '@prisma/client';

@Injectable()
export class WishlistService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getDataWishlist(user: user): Promise<WebResponse<wishlistResponse>> {
        const wishList = await this.prismaService.wishList.findMany({
            where: {
                userId: user.id
            }
        })

        return {
            message: getDataSuccess,
            success: true,
            data: {
                record: wishList.length,
                item: wishList
            }
        }
    }

    async updateDataWishlist(user: user, body: wishlistRequest): Promise<WebResponse<any>> {
        const dataWishList = await this.prismaService.wishList.findFirst({
            where: {
                userId: user.id,
                itemStoreId: body.itemStoreId
            }
        })

        let message = ''

        if (dataWishList) {
            await this.prismaService.wishList.delete({
                where: {
                    itemStoreId_userId: {
                        itemStoreId: body.itemStoreId,
                        userId: user.id
                    }
                }
            })

            message = deleteDataSuccess
        } else {
            await this.prismaService.wishList.create({
                data: {
                    itemStoreId: body.itemStoreId,
                    userId: user.id
                }
            })

            message = postDataSuccess
        }

        return {
            message: message,
            success: true,
        }
    }
}
