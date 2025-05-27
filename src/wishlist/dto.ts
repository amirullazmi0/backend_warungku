export interface wishlistResponse {
  record: number | undefined;
  item: itemWishlistType | itemWishlistType[];
}

export interface itemWishlistType {
  userId: string;
  itemStoreId: string;
}

export interface wishlistRequest {
  itemStoreId: string;
}
