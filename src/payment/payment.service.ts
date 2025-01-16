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
