export interface StoreGlobalsResponse {
    record: number,
    item: StoreResponse | StoreResponse[]
}

export interface StoreResponse {
    id: string;
    name: string;
    email: string;
    bio: string;
    logo: string;
    address: StoreAddressResponse;
}

export interface StoreAddressResponse {
    id: string
    jalan: string
    rt: string
    rw: string
    kodepos: string
    kelurahan: string
    kecamatan: string
    kota: string
    provinsi: string
}