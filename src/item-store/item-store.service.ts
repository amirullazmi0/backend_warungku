import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { itemStore, itemStoreResponse } from './response';
import { getDataSuccess } from 'DTO/message';
import { user } from '@prisma/client';

@Injectable()
export class ItemStoreService {
  constructor(private prismaService: PrismaService) {}

  async getDataItemStore(
    id?: string,
    user?: user,
  ): Promise<WebResponse<itemStoreResponse>> {
    try {
      const data: itemStore[] = await this.prismaService.$queryRaw`
      SELECT 
          item.id, 
          item.name, 
          item.qty, 
          item.price, 
          item."desc", 
          item."createdAt", 
          item."updatedAt",
          jsonb_build_object(
              'id', s.id,
              'name', s."name"
          ) AS "store",
          jsonb_build_object(
              'kota', CASE WHEN sa.kota = '' THEN NULL ELSE sa.kota END, 
              'provinsi', CASE WHEN sa.provinsi = '' THEN NULL ELSE sa.provinsi END
          ) AS "storeAddress",
          jsonb_agg(
              jsonb_build_object(
                  'path', CASE WHEN isi."path" = '' THEN NULL ELSE isi."path" END
              )
          ) AS "itemStorageImage",
          CASE 
              WHEN w."itemStoreId" IS NOT NULL THEN true
              ELSE false
          END AS "wishlist"
      FROM "item_store" item
      LEFT JOIN "store" s ON s.id = item."userId"
      LEFT JOIN "store_address" sa ON sa.id = s."addressId"
      LEFT JOIN item_store_images isi ON item.id = isi."itemstoreId"
      LEFT JOIN wishlist w ON w."itemStoreId" = item.id AND w."userId" = ${user.id}::UUID
      GROUP BY 
          item.id, 
          item.name, 
          item.qty, 
          item.price, 
          item."desc", 
          item."createdAt", 
          item."updatedAt", 
          item."userId", 
          sa.kota, 
          sa.provinsi, 
          s.id, 
          s."name", 
          w."itemStoreId"
      ORDER BY item."createdAt" DESC;

      `;

      return {
        message: getDataSuccess,
        success: true,
        data: {
          record: data.length,
          item: data,
        },
      };
    } catch (error) {
      return;
    }
  }
}
