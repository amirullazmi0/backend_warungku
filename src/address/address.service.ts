import { Injectable, NotFoundException } from '@nestjs/common';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import { addressCreateRequest, addressCreateSchema, addressCRUDResponse, addressUpdateSchema } from 'model/address.model';
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

    async updateAddressProfile(user: user, req: addressCreateRequest): Promise<WebResponse<any>> {
        try {
            if (!user) {
                throw new NotFoundException(dataNotFound)
            }

            if (user.addressId) {
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

                const update = this.prismaService.address.update({
                    where: { id: user.addressId },
                    data: validate
                })
                return {
                    success: true,
                    message: updateDataSuccess,
                    data: update
                }
            } else {
                const id = randomUUID()

                const validate = addressCreateSchema.parse({
                    id: id,
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

                const create = this.prismaService.address.create({
                    data: {
                        id: validate.id,
                        active: validate.active,
                        jalan: validate.jalan,
                        rt: validate.rt,
                        rw: validate.rw,
                        kodepos: validate.kodepos,
                        kelurahan: validate.kelurahan,
                        kecamatan: validate.kecamatan,
                        kota: validate.kota,
                        provinsi: validate.provinsi
                    }
                })
                return {
                    success: true,
                    message: updateDataSuccess,
                    data: create
                }
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
