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
        store.id AS store_id,
        store.name AS store_name,
        store.email AS store_email,
        store.bio AS store_bio,
        store.logo AS store_logo,
        json_agg(
          json_build_object(
            'cart_id', sc.id,
            'quantity', sc.qty,
            'item_id', item.id,
            'item_name', item.name,
            'item_price', item.price,
            'item_description', item."desc",
            'item_image_paths', img_paths.image_paths,
            'category_name', c.name
          )
        ) AS items
      FROM shopping_cart_customer sc
      LEFT JOIN "item_store" AS item ON sc."itemStoreId" = item.id
      LEFT JOIN (
        SELECT 
          isi."itemstoreId", 
          array_agg(DISTINCT isi.path) AS image_paths
        FROM "item_store_images" isi
        GROUP BY isi."itemstoreId"
      ) AS img_paths ON item.id = img_paths."itemstoreId"
      LEFT JOIN "category_item_store" cis ON item.id = cis."itemStoreId"
      LEFT JOIN "category" c ON cis."categoryId" = c.id
      LEFT JOIN "store" store ON item."userId" = store.id
      WHERE 
        sc."userId" = ${dbUser.id}::uuid
      AND sc.status_payment = 'UNPAID'
      GROUP BY store.id, store.name, store.email, store.bio, store.logo;
    `;

    return {
      success: true,
      data: cartItems,
    };
  }

  async findSettledOrders(accessToken: string) {
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
    const query = `
      SELECT
        store.id AS store_id,
        store.name AS store_name,
        store.email AS store_email,
        store.bio AS store_bio,
        store.logo AS store_logo,
        sc.url_not_paid,
        sc.order_id,
        json_agg(
          json_build_object(
            'cart_id', sc.id,
            'quantity', sc.qty,
            'item_id', item.id,
            'item_name', item.name,
            'item_price', item.price,
            'item_description', item."desc",
            'item_image_paths', img_paths.image_paths,
            'category_name', c.name
          )
        ) AS items
      FROM shopping_cart_customer sc
      LEFT JOIN "item_store" AS item ON sc."itemStoreId" = item.id
      LEFT JOIN (
        SELECT 
          isi."itemstoreId", 
          array_agg(DISTINCT isi.path) AS image_paths
        FROM "item_store_images" isi
        GROUP BY isi."itemstoreId"
      ) AS img_paths ON item.id = img_paths."itemstoreId"
      LEFT JOIN "category_item_store" cis ON item.id = cis."itemStoreId"
      LEFT JOIN "category" c ON cis."categoryId" = c.id
      LEFT JOIN "store" store ON item."userId" = store.id
      WHERE 
        sc."userId" = $1::uuid
        AND sc.status_payment = 'SETTLEMENT'
      GROUP BY store.id, store.name, store.email, store.bio, store.logo, sc.url_not_paid, sc.order_id;
    `;
    const orders = await this.prismaService.$queryRawUnsafe(query, dbUser.id);
    if (!orders) {
      throw new NotFoundException('No settled orders found for the user.');
    }
    return orders;
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
