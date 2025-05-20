import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { itemStore, itemStoreResponse } from './response';
import { getDataFailed, getDataSuccess } from 'DTO/message';
import { Prisma, user } from '@prisma/client';

@Injectable()
export class ItemStoreService {
  constructor(private prismaService: PrismaService) { }

  async getDataItemStore(
    id?: string,
    user?: user,
    keyword?: string,
    category?: string[]
  ): Promise<WebResponse<itemStoreResponse>> {
    try {
      const conditions: Prisma.Sql[] = [];

      if (id && id !== "") {
        conditions.push(Prisma.sql`item.id = ${id}::UUID`);
      }

      if (keyword && keyword != null) {
        conditions.push(
          Prisma.sql`(item.name ILIKE '%' || ${keyword} || '%' OR c.name ILIKE '%' || ${keyword} || '%')`
        );
      }

      if (category && category.length > 0) {
        conditions.push(
          Prisma.sql`c.id IN (${Prisma.join(
            category.map((cat) => Prisma.sql`${cat}::UUID`)
          )})`
        );
      }

      const whereClause =
        conditions.length > 0
          ? Prisma.sql`WHERE ${Prisma.join(conditions, ` AND `)}`
          : Prisma.empty;

      const query = Prisma.sql`
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
        (
          SELECT COALESCE(jsonb_agg(jsonb_build_object('path', CASE WHEN isi2."path" = '' THEN NULL ELSE isi2."path" END)), '[]'::jsonb)
          FROM item_store_images isi2
          WHERE isi2."itemstoreId" = item.id
        ) AS "itemStorageImage",
        (
          SELECT COALESCE(jsonb_agg(jsonb_build_object('id', cis2."categoryId", 'name', c2."name")), '[]'::jsonb)
          FROM category_item_store cis2
          JOIN category c2 ON c2.id = cis2."categoryId"
          WHERE cis2."itemStoreId" = item.id
        ) AS "categories",
        CASE WHEN w."itemStoreId" IS NOT NULL THEN true ELSE false END AS "wishlist"
      FROM "item_store" item
      LEFT JOIN "store" s ON s.id = item."userId"
      LEFT JOIN "store_address" sa ON sa.id = s."addressId"
      LEFT JOIN wishlist w ON w."itemStoreId" = item.id AND w."userId" = ${user?.id}::UUID
      LEFT JOIN category_item_store cis ON cis."itemStoreId" = item.id
      LEFT JOIN category c ON c.id = cis."categoryId"
      ${whereClause}
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
      const data: itemStore[] = await this.prismaService.$queryRaw(query);

      return {
        message: getDataSuccess,
        success: true,
        data: {
          record: data.length,
          item: data,
        },
      };
    } catch (error) {
      console.error('Error in getDataItemStore:', error);
      return {
        success: false,
        message: getDataFailed,
        errors: error.message,
      };
    }
  }



  async getCategory(): Promise<WebResponse<any>> {
    try {

      const data = await this.prismaService.$queryRaw`
        select * from "category"
      `
      return {
        success: true,
        message: getDataSuccess,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        message: getDataFailed,
      }
    }
  }
}

