import { Injectable, NotFoundException } from '@nestjs/common';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import { addressCreateRequest, addressCreateSchema, addressCRUDResponse, addressUpdateRequest, addressUpdateSchema } from 'model/address.model';
import { dataNotFound, getDataFailed, getDataSuccess, updateDataFailed, updateDataSuccess } from 'model/message';
import { userCreateRequest } from 'model/user.model';
import { WebResponse } from 'model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getAddress(user: user): Promise<WebResponse<any>> {
        try {
            const address = await this.prismaService.address.findFirst({
                where: { id: user.addressId }
            })


            if (!address) {
                throw new NotFoundException(dataNotFound)
            }

            return {
                success: true,
                message: getDataSuccess,
                data: address
            }
        } catch (error) {
            return {
                success: false,
                message: getDataFailed,
                errors: error
            }
        }
    }

    async updateAddressProfile(user: user, req: addressUpdateRequest): Promise<WebResponse<any>> {
        try {
            if (!user) {
                throw new NotFoundException(dataNotFound)
            }

            const validate = addressUpdateSchema.parse({
                active: req.active,
                jalan: req.jalan,
                rt: req.rt,
                rw: req.rw,
                kodepos: req.kodepos,
                kelurahan: req.kelurahan,
                kecamatan: req.kecamatan,
                kota: req.kota,
                provinsi: req.provinsi,
            })            

            const update = await this.prismaService.address.update({
                where: { id: user.addressId },
                data: validate
            })
            
            return {
                success: true,
                message: updateDataSuccess,
                data: update
            }

        } catch (error) {
            return {
                success: false,
                message: updateDataFailed,
                errors: error
            }
        }
    }
}
