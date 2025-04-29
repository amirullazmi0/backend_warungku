import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  // async create(createTransactionDto: CreateTransactionDto) {
  //   return 'This action adds a new transaction';
  // }

  async findAllByUser(accessToken: string) {
    // 1) Validate the user token
    const user = await this.authService.validateUserFromToken(accessToken);
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }

    // 2) Retrieve the user record
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) {
      throw new NotFoundException('User not found in database');
    }

    // 3) Query shopping_cart_customer (sc) and item_store (i)
    //    Group by order_id so each order is returned once,
    //    building an invoice JSON with multiple items
    const transactions = await this.prismaService.$queryRaw<
      Array<{
        transaction_id: string;
        customerId: string;
        invoice: any; // The rebuilt invoice JSON
        total: string; // Casting sum to numeric => string
        store_user_id: string | null;
        createdAt: Date;
        updatedAt: Date;
        customer_fullName: string;
        customer_email: string;
        customer_address: string | null;
        customer_city: string | null;
      }>
    >(Prisma.sql`
      SELECT
        sc.order_id AS transaction_id,
        sc."userId" AS customerId,
        jsonb_build_object(
          'date', MIN(sc."reatedAt")::text,
          'invoiceNumber', sc.order_id,
          'status', sc.status_payment,
          'items', json_agg(
            json_build_object(
              'cartItemId', sc.id,
              'itemStoreId', sc."itemStoreId",
              'qty', sc.qty,
              'itemName', i.name,
              'price', i.price,
              'desc', i."desc",
              'images', (
                SELECT (array_agg(isi.path))[1]
                FROM "item_store_images" isi
                WHERE isi."itemstoreId" = i.id
              )
            )
          )
        ) AS invoice,
        -- Cast to numeric to avoid BigInt JSON serialization error
        SUM(i.price * sc.qty)::numeric AS total,
        -- Use MIN (or MAX) to pick a single store_user_id for the entire order
        i."userId" AS store_user_id,
        MIN(sc."reatedAt") AS createdAt,
        MAX(sc."updatedAt") AS updatedAt,
        cu."fullName" AS customer_fullName,
        cu.email AS customer_email,
        ca.jalan AS customer_address,
        ca.kota AS customer_city
      FROM shopping_cart_customer sc
      JOIN item_store i ON sc."itemStoreId" = i.id
      JOIN customer_user cu ON sc."userId" = cu.id
      LEFT JOIN customer_address ca ON cu."addressId" = ca.id
      WHERE sc."userId" = ${dbUser.id}::uuid
      GROUP BY
        i."userId",
        sc.order_id,
        sc.status_payment,
        cu."fullName",
        cu.email,
        ca.jalan,
        ca.kota,
        sc."userId"
      ORDER BY MIN(sc."reatedAt") DESC
    `);

    return transactions;
  }

  async findAll() {
    const transactions = await this.prismaService.$queryRaw<
      Array<{
        transaction_id: string;
        customerId: string;
        invoice: any;
        total: number;
        store_user_id: string;
        createdAt: Date;
        updatedAt: Date;
        items: any;
        customer_fullName: string;
        customer_email: string;
        customer_address: string | null;
        customer_city: string | null;
      }>
    >(Prisma.sql`
      SELECT 
        t.id AS transaction_id,
        t."customerId",
        t.invoice,
        t.total,
        t."userId" AS store_user_id,
        t."createdAt",
        t."updatedAt",
        json_agg(
          json_build_object(
            'itemStoreId', tis."itemStoreId",
            'qty', tis.qty,
            'itemName', i.name,
            'price', i.price,
            'desc', i."desc",
            'images', (
              SELECT array_agg(isi.path)
              FROM "item_store_images" isi
              WHERE isi."itemstoreId" = i.id
            )
          )
        ) AS items,
        cu."fullName" AS customer_fullName,
        cu.email AS customer_email,
        ca.jalan AS customer_address,
        ca.kota AS customer_city
      FROM transaction t
      JOIN transaction_item_store tis ON t.id = tis."transactionId"
      JOIN item_store i ON tis."itemStoreId" = i.id
      JOIN customer_user cu ON t."customerId" = cu.id
      LEFT JOIN customer_address ca ON cu."addressId" = ca.id
      -- WHERE t.invoice::json->>'status' = 'PAID'
      GROUP BY 
        t.id, t."customerId", t.invoice, t.total, t."userId", t."createdAt", t."updatedAt",
        cu."fullName", cu.email, ca.jalan, ca.kota
    `);
    return transactions;
  }

  async findByUser(accessToken: string, status: string) {
    const user = await this.authService.validateUserFromToken(accessToken);
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      throw new NotFoundException('User not found in database');
    }

    const transactions = await this.prismaService.$queryRaw<
      Array<{
        transaction_id: string;
        customerId: string;
        invoice: any;
        total: number;
        store_user_id: string;
        createdAt: Date;
        updatedAt: Date;
        items: any;
        customer_fullName: string;
        customer_email: string;
        customer_address: string | null;
        customer_city: string | null;
      }>
    >(Prisma.sql`
      SELECT 
      t.id AS transaction_id,
      t."customerId",
      jsonb_build_object(
        'date', t.invoice::json->>'date',
        'invoiceNumber', t.invoice::json->>'invoiceNumber',
        'status', t.invoice::json->>'status',
        'items', json_agg(
          json_build_object(
            'itemStoreId', tis."itemStoreId",
            'qty', tis.qty,
            'itemName', i.name,
            'price', i.price,
            'desc', i."desc",
            'images', (
              SELECT (array_agg(isi.path))[1]
              FROM "item_store_images" isi
              WHERE isi."itemstoreId" = i.id
            )
          )
        )
      ) AS invoice,
      t.total,
      t."userId" AS store_user_id,
      t."createdAt",
      t."updatedAt",
      cu."fullName" AS customer_fullName,
      cu.email AS customer_email,
      ca.jalan AS customer_address,
      ca.kota AS customer_city
    FROM transaction t
    JOIN transaction_item_store tis ON t.id = tis."transactionId"
    JOIN item_store i ON tis."itemStoreId" = i.id
    JOIN customer_user cu ON t."customerId" = cu.id
    LEFT JOIN customer_address ca ON cu."addressId" = ca.id
    WHERE t.invoice::json->>'status' = ${status}
      AND i."userId" = ${dbUser.id}::uuid
    GROUP BY 
      t.id, t."customerId", t.invoice, t.total, t."userId", t."createdAt", t."updatedAt",
      cu."fullName", cu.email, ca.jalan, ca.kota`);

    return transactions;
  }

  async findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const { newStatus } = updateTransactionDto;
    const result = await this.prismaService.$queryRaw<
      Array<{ invoice: any }>
    >(Prisma.sql`
      SELECT invoice FROM transaction WHERE id = ${id}::uuid
    `);
    if (!result || result.length === 0) {
      throw new NotFoundException('Transaction not found');
    }
    const currentInvoice = result[0].invoice;
    let finalStatus = newStatus;
    if (newStatus === 'selesai' && currentInvoice.status === 'dipesan') {
      finalStatus = 'diproses';
    }

    await this.prismaService.$executeRaw(
      Prisma.sql`
        UPDATE transaction
        SET invoice = jsonb_set(invoice, '{status}', to_jsonb(${finalStatus}))
        WHERE id = ${id}::uuid
      `,
    );
    return { success: true, message: 'Transaction invoice status updated.' };
  }

  async remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
