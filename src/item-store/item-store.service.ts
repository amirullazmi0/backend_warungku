import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { itemStore, itemStoreResponse } from './response';
import { getDataSuccess } from 'DTO/message';

@Injectable()
export class ItemStoreService {
  constructor(private prismaService: PrismaService) { }

  async getDataItemStore(id?: string): Promise<WebResponse<itemStoreResponse>> {
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
                    item."userId" AS "storeId", 
                    jsonb_build_object(
                        'kota', CASE WHEN sa.kota = '' THEN NULL ELSE sa.kota END, 
        'provinsi', CASE WHEN sa.provinsi = '' THEN NULL ELSE sa.provinsi END
                    ) AS "storeAddress",
                    jsonb_build_object(
                        'path', CASE WHEN isi."path" = '' THEN NULL ELSE isi."path" END
                    ) AS "itemStorageImage"
                FROM "item_store" item
                LEFT JOIN "store" s ON s.id = item."userId"
                LEFT JOIN "store_address" sa ON sa.id = s."addressId"
                LEFT JOIN item_store_images isi ON item.id = isi."itemstoreId"
                ORDER BY item."createdAt" DESC
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
