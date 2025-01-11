export interface itemStoreResponse {
    record: number | undefined,
    item: itemStore | itemStore[]

}

export interface itemStore {
    id: string,
    name: string,
    qty: number,
    price: number,
    desc: string,
    createdAt: Date,
    updatedAt: Date,
    storeId: string,
    itemStorageImage: {
        path: string[]
    },
    category: string[],
    storeAddress: {
        kota: string,
        provinsi: string
    }
}
