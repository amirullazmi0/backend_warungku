export interface itemStoreGuestResponse {
  record: number | undefined;
  item: itemStoreGuest | itemStoreGuest[];
}

export interface itemStoreGuest {
  id: string;
  name: string;
  qty: number;
  price: number;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  store: {
    id: string;
    name: string;
  };

  itemStorageImage: {
    path: string;
  }[];


  storeAddress: {
    kota: string;
    provinsi: string;
  };

  categories: {
    id: string;
    name: string;
  }[];
}
