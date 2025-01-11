// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async addToCart(accessToken: string, itemStoreId: string): Promise<any> {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;

    let cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prismaService.cart.create({
        data: {
          userId,
        },
      });
    }

    const existingCartItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_itemStoreId: {
          cartId: cart.id,
          itemStoreId: itemStoreId,
        },
      },
    });

    if (existingCartItem) {
      return this.prismaService.cartItem.update({
        where: {
          cartId_itemStoreId: {
            cartId: cart.id,
            itemStoreId: itemStoreId,
          },
        },
        data: {
          qty: existingCartItem.qty + 1,
        },
      });
    }

    const cartItem = await this.prismaService.cartItem.create({
      data: {
        cartId: cart.id,
        itemStoreId: itemStoreId,
        qty: 1,
      },
    });

    return {
      success: true,
      message: 'Item added to cart',
      data: cartItem,
    };
  }

  async removeFromCart(accessToken: string, itemStoreId: string): Promise<any> {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;

    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        cartId_itemStoreId: {
          cartId: cart.id,
          itemStoreId: itemStoreId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prismaService.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return {
      success: true,
      message: 'Item removed from cart',
    };
  }

  async getCart(accessToken: string): Promise<any> {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;

    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            itemStore: {
              include: {
                itemStoreImages: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        success: true,
        message: 'Cart is empty',
        data: [],
      };
    }

    return cart.cartItems;
  }

  async updateCartQty(
    accessToken: string,
    itemStoreId: string,
    qty: number,
  ): Promise<any> {
    const user = await this.authService.validateUserFromToken(accessToken);

    const userByEmail = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userByEmail) {
      throw new NotFoundException('User not found');
    }
    const userId = userByEmail.id;

    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const cartItem = await this.prismaService.cartItem.findUnique({
      where: {
        id: itemStoreId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (qty <= 0) {
      throw new NotFoundException('Quantity must be greater than 0');
    }

    const updatedCartItem = await this.prismaService.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        qty: qty,
      },
    });

    return {
      success: true,
      message: 'Cart item quantity updated',
      data: updatedCartItem,
    };
  }
}
