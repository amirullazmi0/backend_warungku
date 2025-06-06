import { Body, Controller, Get, Post, Delete, Headers } from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartQtyDto,
} from './dto/cart.dto';
import { apiCart } from 'src/common/url';

@Controller(`${apiCart}`)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    const { accessToken, itemStoreId, qty } = addToCartDto;
    return this.cartService.addToCart(accessToken, itemStoreId, qty);
  }

  @Delete('remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    const { accessToken, itemStoreId } = removeFromCartDto;
    return this.cartService.removeFromCart(accessToken, itemStoreId);
  }

  @Get('get-cart')
  async getCart(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.cartService.getCartItems(token);
  }

  @Get('settled')
  async getSettledOrders(@Headers('authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    return this.cartService.findSettledOrders(token);
  }

  @Post('update-qty')
  async updateCartQty(@Body() updateCartQtyDto: UpdateCartQtyDto) {
    const { accessToken, itemStoreId, qty } = updateCartQtyDto;
    return this.cartService.updateCartQty(accessToken, itemStoreId, qty);
  }

  @Post('cancel-order')
  async cancelOrder(@Body() body: { accessToken: string; orderId: string }) {
    const { accessToken, orderId } = body;
    return this.cartService.cancelOrder(accessToken, orderId);
  }
}
