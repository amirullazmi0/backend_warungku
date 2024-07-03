import { Injectable } from '@nestjs/common';
import { store } from '@prisma/client';
import { getDataFailed, getDataSuccess } from 'model/message';
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
                        _count: true,
                        transactions: true,
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
}
