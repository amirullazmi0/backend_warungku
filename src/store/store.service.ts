import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { store } from '@prisma/client';
import { dataNotFound, deleteDataFailed, deleteDataSuccess, getDataFailed, getDataSuccess, updateDataFailed, updateDataSuccess, updatePasswordFailed, updatePasswordSuccess } from 'model/message';
import { storeCRUDResponse, storeUpdatePasswordRequest, storeUpdateRequest, storeUpdateSchema } from 'model/store.model';
import { WebResponse } from 'model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getData(id?: string): Promise<WebResponse<{ record: number | undefined; store: store[] | store; }>> {
        try {
            let store: store | store[];

            store = await this.prismaService.store.findMany({
                include: {
                    // itemStore: true,
                    // transactions: true,
                },
            });
            if (id) {
                store = await this.prismaService.store.findFirst({
                    where: {
                        id: id,
                    },
                    include: {
                        // itemStore: true,
                        // transactions: true,
                    },
                });
            }

            return {
                success: true,
                message: getDataSuccess,
                data: {
                    record: Array.isArray(store) ? store.length : undefined,
                    store: store
                },
            };
        } catch (error) {
            return {
                success: false,
                message: getDataFailed,
                errors: error,
            };
        }
    }

    async updateProfileStore(id: string, req: storeUpdateRequest): Promise<WebResponse<storeCRUDResponse>> {
        try {
            let store = await this.prismaService.store.findFirst({
                where: { id: id }
            })

            if (!store) {
                throw new NotFoundException(dataNotFound)
            }

            const validate = storeUpdateSchema.parse({
                email: req.email ? req.email : store.email,
                fullName: req.fullName ? req.fullName : store.email,
                logo: req.logo ? req.logo : store.logo,
                bio: req.bio ? req.bio : store.bio,
                addressId: req.addressId ? req.addressId : store.addressId
            })

            store = await this.prismaService.store.update({
                where: { id: id },
                data: {
                    email: validate.email,
                    fullName: validate.fullName,
                    
                }
            })

            return {
                success: true,
                message: updateDataSuccess,
                data: {
                    email: store.email,
                    fullName: store.fullName,
                    accessToken: store.accessToken,
                    refreshToken: store.accessToken
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

    async updatePasswordById(id: string, req: storeUpdatePasswordRequest): Promise<WebResponse<any>> {
        try {
            let data = await this.prismaService.store.findFirst({
                where: { id: id },
            })

            if (!data || !req.password) {
                throw new BadRequestException()
            }

            data = await this.prismaService.store.update({
                where: { id: id },
                data: {
                    password: req.password
                }
            })
            return {
                success: true,
                message: updatePasswordSuccess
            }
        } catch (error) {
            return {
                success: false,
                message: updatePasswordFailed,
                errors: error
            }
        }
    }

    async updatePasswordProfile(store: store, req: storeUpdatePasswordRequest): Promise<WebResponse<any>> {
        try {
            let data = await this.prismaService.store.findFirst({
                where: { id: store.id },
            })

            if (!data || !req.password) {
                throw new BadRequestException()
            }

            data = await this.prismaService.store.update({
                where: { id: store.id },
                data: {
                    password: req.password
                }
            })
            return {
                success: true,
                message: updatePasswordSuccess
            }
        } catch (error) {
            return {
                success: false,
                message: updatePasswordFailed,
                errors: error
            }
        }
    }

    async deleteById(id: string): Promise<WebResponse<any>> {
        let data = await this.prismaService.store.findFirst({
            where: { id: id }
        })

        if (!data) {
            throw new NotFoundException(dataNotFound)
        }
        data = await this.prismaService.store.delete({
            where: { id: data.id }
        })

        try {
            return {
                success: true,
                message: deleteDataSuccess
            }
        } catch (error) {
            return {
                success: false,
                message: deleteDataFailed,
                errors: error
            }
        }
    }
}
