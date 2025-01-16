import { Injectable } from '@nestjs/common';
import { WebResponse } from 'DTO/globals.dto';
import { getDataSuccess } from 'DTO/message';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreGlobalsResponse, StoreResponse } from './response';

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}

  async getDataStore(id?: string): Promise<WebResponse<StoreGlobalsResponse>> {
    let data: StoreResponse[];

    if (id) {
      data = await this.prismaService.$queryRaw`
            select 
                s.id,
                s."name" ,
                s.email ,
                s.bio ,
                s.logo,
                jsonb_build_object(
                    'id', sa.id ,
                    'jalan', sa.jalan ,
                    'rt', sa.rt ,
                    'rw', sa.rw ,
                    'kodepos', sa.kodepos ,
                    'kelurahan', sa.kelurahan ,
                    'kecamatan', sa.kecamatan ,
                    'kota', sa.kota ,
                    'provinsi', sa.provinsi 
                ) as address
            from "store" s
            left join store_address sa on sa.id = s."addressId" 
            where s."rolesName" = 'user' and s.id = ${id}::uuid
        `;
    } else {
      data = await this.prismaService.$queryRaw`
            select 
                s.id,
                s."name" ,
                s.email ,
                s.bio ,
                s.logo,
                jsonb_build_object(
                    'id', sa.id ,
                    'jalan', sa.jalan ,
                    'rt', sa.rt ,
                    'rw', sa.rw ,
                    'kodepos', sa.kodepos ,
                    'kelurahan', sa.kelurahan ,
                    'kecamatan', sa.kecamatan ,
                    'kota', sa.kota ,
                    'provinsi', sa.provinsi 
                ) as address
            from "store" s
            left join store_address sa on sa.id = s."addressId" 
            where s."rolesName" = 'user'
        `;
    }

    return {
      message: getDataSuccess,
      success: true,
      data: {
        record: data.length,
        item: data,
      },
    };
  }
}
