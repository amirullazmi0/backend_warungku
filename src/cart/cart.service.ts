import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async addToCart(accessToken: string, itemStoreId: string, qty: number) {
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

    const existingCartItem = await this.prismaService.shoppingCart.findFirst({
      where: {
        userId: dbUser.id,
        itemStoreId,
      },
    });

    if (existingCartItem) {
      const updatedItem = await this.prismaService.shoppingCart.update({
        where: { id: existingCartItem.id },
        data: {
          qty: existingCartItem.qty + qty,
        },
      });
      return {
        success: true,
        message: 'Item quantity updated in cart',
        data: updatedItem,
      };
    }

    const newCartItem = await this.prismaService.shoppingCart.create({
      data: {
        itemStoreId,
        qty,
        userId: dbUser.id,
      },
    });

    return {
      success: true,
      message: 'Item added to cart',
      data: newCartItem,
    };
  }

  async removeFromCart(accessToken: string, cartItemId: string) {
    const user = await this.authService.validateUserFromToken(accessToken);
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }

    const existingCartItem = await this.prismaService.shoppingCart.findUnique({
      where: { id: cartItemId },
    });
    if (!existingCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prismaService.shoppingCart.delete({
      where: { id: cartItemId },
    });

    return {
      success: true,
      message: 'Item removed from cart',
    };
  }

  async getCartItems(accessToken: string) {
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

    const cartItems = await this.prismaService.shoppingCart.findMany({
      where: { userId: dbUser.id },
    });

    return {
      success: true,
      data: cartItems,
    };
  }

  async updateCartQty(accessToken: string, cartItemId: string, qty: number) {
    const user = await this.authService.validateUserFromToken(accessToken);
    if (!user) {
      throw new NotFoundException('User not found or token invalid');
    }

    const existingCartItem = await this.prismaService.shoppingCart.findUnique({
      where: { id: cartItemId },
    });
    if (!existingCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const updatedCartItem = await this.prismaService.shoppingCart.update({
      where: { id: cartItemId },
      data: { qty },
    });

    return {
      success: true,
      message: 'Cart item quantity updated',
      data: updatedCartItem,
    };
  }
}
