import { Body, Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  RemoveFromCartDto,
  UpdateCartQtyDto,
} from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    const { accessToken, itemStoreId } = addToCartDto;
    return this.cartService.addToCart(accessToken, itemStoreId);
  }

  @Delete('remove')
  async removeFromCart(@Body() removeFromCartDto: RemoveFromCartDto) {
    const { accessToken, itemStoreId } = removeFromCartDto;
    return this.cartService.removeFromCart(accessToken, itemStoreId);
  }

  @Get('user/:accessToken')
  async getCart(@Param('accessToken') accessToken: string) {
    return this.cartService.getCart(accessToken);
  }

  @Post('update-qty')
  async updateCartQty(@Body() updateCartQtyDto: UpdateCartQtyDto) {
    const { accessToken, itemStoreId, qty } = updateCartQtyDto;
    return this.cartService.updateCartQty(accessToken, itemStoreId, qty);
  }
}
