import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
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
  async getCart(@Param('accessToken') accessToken: string) {
    return this.cartService.getCartItems(accessToken);
  }

  @Post('update-qty')
  async updateCartQty(@Body() updateCartQtyDto: UpdateCartQtyDto) {
    const { accessToken, itemStoreId, qty } = updateCartQtyDto;
    return this.cartService.updateCartQty(accessToken, itemStoreId, qty);
  }
}
