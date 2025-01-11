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

    const itemStore = await this.prismaService.$queryRaw<
      { qty: number }[]
    >`SELECT qty FROM item_store WHERE id = ${itemStoreId}::uuid`;

    if (itemStore.length === 0) {
      throw new NotFoundException('Item not found in store');
    }

    if (itemStore[0].qty < qty) {
      throw new NotFoundException('Not enough stock available');
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

      await this.prismaService.$executeRaw`
        UPDATE item_store
        SET qty = qty - ${qty}
        WHERE id = ${itemStoreId}::uuid`;

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

    await this.prismaService.$executeRaw`
      UPDATE item_store
      SET qty = qty - ${qty}
      WHERE id = ${itemStoreId}::uuid`;

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

    await this.prismaService.$executeRaw`
      UPDATE item_store
      SET qty = qty + ${existingCartItem.qty}
      WHERE id = ${existingCartItem.itemStoreId}::uuid`;

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
    const cartItems = await this.prismaService.$queryRaw`
    SELECT
      sc.id AS cart_id,
      sc.qty AS quantity,
      item.id AS item_id,
      item.name AS item_name,
      item.price AS item_price,
      item."desc" AS item_description,
      isi.path AS item_image_path,
      c.name AS category_name
        FROM shopping_cart_customer sc
      LEFT JOIN "item_store" AS item ON sc."itemStoreId" = item.id
      LEFT JOIN "item_store_images" isi ON item.id = isi."itemstoreId"
      LEFT JOIN "category_item_store" cis ON item.id = cis."itemStoreId"
      LEFT JOIN "category" c ON cis."categoryId" = c.id
      WHERE sc."userId" = ${dbUser.id}::uuid;
    `;
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

    const qtyDifference = qty - existingCartItem.qty;

    if (qtyDifference > 0) {
      const itemStore = await this.prismaService.$queryRaw<
        { qty: number }[]
      >`SELECT qty FROM item_store WHERE id = ${existingCartItem.itemStoreId}::uuid`;

      if (itemStore.length === 0) {
        throw new NotFoundException('Item not found in store');
      }

      if (itemStore[0].qty < qtyDifference) {
        throw new NotFoundException('Not enough stock available');
      }

      await this.prismaService.$executeRaw`
        UPDATE item_store
        SET qty = qty - ${qtyDifference}
        WHERE id = ${existingCartItem.itemStoreId}::uuid`;
    } else if (qtyDifference < 0) {
      await this.prismaService.$executeRaw`
        UPDATE item_store
        SET qty = qty + ${Math.abs(qtyDifference)}
        WHERE id = ${existingCartItem.itemStoreId}::uuid`;
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
