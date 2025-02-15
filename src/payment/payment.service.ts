import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import * as midtransClient from 'midtrans-client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  private snap: midtransClient.Snap;
  private authService: AuthService;
  private readonly prismaService: PrismaService;

  constructor(authService: AuthService, prismaService: PrismaService) {
    this.prismaService = prismaService;
    this.authService = authService;
    this.snap = new midtransClient.Snap({
      isProduction: false,
      clientKey: 'SB-Mid-client-g7DzPGpxRHrj04Vn',
      serverKey: 'SB-Mid-server-IIVdFLgfdJMn8q6k5GnrzlKo',
    });
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const user = await this.authService.validateUserFromToken(
      createPaymentDto.accessToken,
    );
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) {
      throw new NotFoundException('User not found in database');
    }

    const userAddressRecord = await this.prismaService.userAddress.findFirst({
      where: { userId: dbUser.id },
      include: { address: true },
    });

    const addr = userAddressRecord?.address ?? userAddressRecord.address;
    try {
      const totalAmount = createPaymentDto.cartItems.reduce(
        (total, storeCart) => {
          const storeTotal = storeCart.items.reduce((subTotal, item) => {
            if (item.item_price != null && item.quantity != null) {
              return subTotal + item.item_price * item.quantity;
            }
            return subTotal;
          }, 0);
          return total + storeTotal;
        },
        0,
      );
      const orderId = `order-${Date.now()}`;
      const itemDetails: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
        subtotal?: number;
      }> = [];
      createPaymentDto.cartItems.forEach((storeCart) => {
        storeCart.items.forEach((item) => {
          if (item.item_price != null && item.quantity != null) {
            itemDetails.push({
              id: item.item_id || '',
              name: item.item_name || '',
              quantity: item.quantity,
              price: item.item_price,
              subtotal: item.item_price * item.quantity,
            });
          }
        });
      });
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
        item_details: itemDetails,
        customer_details: {
          email: dbUser.email,
          first_name: dbUser.fullName,
          phone: '+628123456789',
          address: addr.jalan,
          city: addr.kota,
          postal_code: addr.kodepos,
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: dbUser.fullName,
          email: dbUser.email,
          phone: '+628123456789',
          address: addr.jalan,
          city: addr.kota,
          postal_code: addr.kodepos,
          country_code: 'IDN',
        },
      };
      const response = await this.snap.createTransaction(parameter);
      const cartIds = createPaymentDto.cartItems.flatMap((storeCart) =>
        storeCart.items.map((item) => item.cart_id),
      );
      await this.prismaService.shoppingCart.updateMany({
        where: {
          id: { in: cartIds },
        },
        data: {
          status_payment: 'SETTLEMENT',
          order_id: orderId,
          url_not_paid: response.redirect_url,
          token_midtrans: response.token,
        },
      });
      return {
        success: true,
        data: response,
        orderId: orderId,
      };
    } catch (error) {
      console.error('Error processing payment with Midtrans:', error);
      throw new InternalServerErrorException('Payment processing failed.');
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }
  async updateStatus(
    authHeader: string,
    updatePaymentStatusDto: CreatePaymentDto,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token missing');
    }
    const token = authHeader.replace('Bearer ', '');
    const user = await this.authService.validateUserFromToken(token);
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!dbUser) {
      throw new NotFoundException('User not found in database');
    }
    try {
      const updated = await this.prismaService.shoppingCart.updateMany({
        where: {
          userId: dbUser.id,
          status_payment: 'SETTLEMENT',
          order_id: updatePaymentStatusDto.orderId,
        },
        data: {
          status_payment: 'PAID',
        },
      });

      if (updated.count > 0) {
        const cartItemsPaid = await this.prismaService.$queryRaw<
          Array<{
            sc_id: string;
            sc_userId: string;
            sc_itemStoreId: string;
            sc_qty: number;
            sc_order_id: string | null;
            sc_status_payment: string;
            item_id: string;
            item_name: string;
            item_qty: number;
            item_price: number;
            item_desc: string | null;
            store_user_id: string;
          }>
        >(
          Prisma.sql`
          SELECT
            sc.id AS sc_id,
            sc."userId" AS sc_userId,
            sc."itemStoreId" AS sc_itemStoreId,
            sc.qty AS sc_qty,
            sc.order_id AS sc_order_id,
            sc.status_payment AS sc_status_payment,
            i.id AS item_id,
            i.name AS item_name,
            i.qty AS item_qty,
            i.price AS item_price,
            i."desc" AS item_desc,
            i."userId" as store_user_id
          FROM "shopping_cart_customer" sc
          JOIN "item_store" i ON sc."itemStoreId" = i.id
          WHERE sc."userId" = ${dbUser.id}::uuid
            AND sc.order_id = ${updatePaymentStatusDto.orderId}
            AND sc.status_payment = 'PAID';
          `,
        );

        const invoiceItems = cartItemsPaid.map((cartItem) => ({
          cartItemId: cartItem.sc_id,
          itemStoreId: cartItem.item_id,
          itemName: cartItem.item_name,
          price: cartItem.item_price,
          quantity: cartItem.sc_qty,
        }));

        const total = invoiceItems.reduce((sum, item) => {
          return sum + item.price * item.quantity;
        }, 0);

        const invoiceNumber = `INV-${Date.now()}`;
        const storeUserId = cartItemsPaid[0].store_user_id;
        const insertedTx = await this.prismaService.$queryRaw<
          Array<{ id: string }>
        >(Prisma.sql`
          INSERT INTO transaction("id", "customerId", "invoice", "total", "userId", "createdAt", "updatedAt")
          VALUES (
            gen_random_uuid(),
            ${dbUser.id}::uuid,
            ${invoiceNumber},
            ${total},
            ${storeUserId}::uuid,
            now(),
            now()
          )
          RETURNING "id";
        `);

        const transactionId = insertedTx[0].id;

        for (const item of invoiceItems) {
          await this.prismaService.$executeRaw`
            INSERT INTO transaction_item_store("transactionId", "itemStoreId", qty)
            VALUES (
              ${transactionId}::uuid,
              ${item.itemStoreId}::uuid,
              ${item.quantity}
            )
          `;
        }
      }
      return { success: true, updatedCount: updated.count };
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new InternalServerErrorException(
        'Failed to update payment status.',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
