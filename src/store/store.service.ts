import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { getDataSuccess } from 'DTO/message';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreGlobalsResponse, StoreResponse } from './response';
import { Prisma, user } from '@prisma/client';
import { itemStore } from 'src/item-store/response';

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}

  async getDataStore(id?: string): Promise<WebResponse<StoreGlobalsResponse>> {
    let data: StoreResponse[];

    if (id) {
      data = await this.prismaService.$queryRaw`
            select 
                s.id,
                s."name" ,
                s.email ,
                s.bio ,
                s.logo,
                jsonb_build_object(
                    'id', sa.id ,
                    'jalan', sa.jalan ,
                    'rt', sa.rt ,
                    'rw', sa.rw ,
                    'kodepos', sa.kodepos ,
                    'kelurahan', sa.kelurahan ,
                    'kecamatan', sa.kecamatan ,
                    'kota', sa.kota ,
                    'provinsi', sa.provinsi 
                ) as address
            from "store" s
            left join store_address sa on sa.id = s."addressId" 
            where s."rolesName" = 'user' and s.id = ${id}::uuid
        `;
    } else {
      data = await this.prismaService.$queryRaw`
            select 
                s.id,
                s."name" ,
                s.email ,
                s.bio ,
                s.logo,
                jsonb_build_object(
                    'id', sa.id ,
                    'jalan', sa.jalan ,
                    'rt', sa.rt ,
                    'rw', sa.rw ,
                    'kodepos', sa.kodepos ,
                    'kelurahan', sa.kelurahan ,
                    'kecamatan', sa.kecamatan ,
                    'kota', sa.kota ,
                    'provinsi', sa.provinsi 
                ) as address
            from "store" s
            left join store_address sa on sa.id = s."addressId" 
            where s."rolesName" = 'user'
        `;
    }

    return {
      message: getDataSuccess,
      success: true,
      data: {
        record: data.length,
        item: data,
      },
    };
  }

  async getDataItemStore(
    id: string,
    user: user,
  ): Promise<WebResponse<itemStore[]>> {
    const data: itemStore[] = await this.prismaService.$queryRaw(
      Prisma.sql`
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
                COALESCE(jsonb_agg(
                    jsonb_build_object(
                        'path', CASE WHEN isi."path" = '' THEN NULL ELSE isi."path" END
                    )
                ) FILTER (WHERE isi."path" IS NOT NULL), '[]'::jsonb) AS "itemStorageImage",
                CASE 
                    WHEN w."itemStoreId" IS NOT NULL THEN true
                    ELSE false
                END AS "wishlist"
            FROM "item_store" item
            LEFT JOIN "store" s ON s.id = item."userId" and s.id = ${id}::uuid
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
            `,
    );

    return {
      message: getDataSuccess,
      success: true,
      data: data,
    };
  }
}
