import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CartItemDto {
  @IsString()
  cart_id: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  item_id?: string | null;

  @IsOptional()
  @IsString()
  item_name?: string | null;

  @IsOptional()
  @IsNumber()
  item_price?: number | null;

  @IsOptional()
  @IsString()
  item_description?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  item_image_paths?: string[] | null;

  @IsOptional()
  @IsString()
  category_name?: string | null;
}

export class StoreCartDto {
  @IsOptional()
  @IsString()
  store_id?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  items: CartItemDto[];
}

export class CreatePaymentDto {
  @IsString()
  accessToken?: string;

  @IsString()
  orderId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  cartItems?: StoreCartDto[];
}
