export class AddToCartDto {
  accessToken: string;
  itemStoreId: string;
  qty: number;
}

export class RemoveFromCartDto {
  accessToken: string;
  itemStoreId: string;
}

export class UpdateCartQtyDto {
  accessToken: string;
  itemStoreId: string;
  qty: number;
}
