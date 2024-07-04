import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthMidlleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService
    ) { }

    async use(req: any, res: any, next: (error?: any) => void) {

        let [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (type === 'Bearer' && token) {
            let user = await this.prismaService.user.findFirst({
                where: {
                    accessToken: token
                }
            })

            if (!user) {
                user = await this.prismaService.user.findFirst({
                    where: {
                        refreshToken: token
                    }
                })
            }

            console.log('auth :', token);

            if (user) {
                req.user = user
            }
        }

        next()
    }
}

export class AuthUserSuperMidlleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService
    ) { }

    async use(req: any, res: any, next: (error?: any) => void) {

        let [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (type === 'Bearer' && token) {
            let user = await this.prismaService.user.findFirst({
                where: {
                    accessToken: token,
                    rolesName: 'super'
                }
            })

            if (!user) {
                user = await this.prismaService.user.findFirst({
                    where: {
                        refreshToken: token,
                        rolesName: 'super'
                    }
                })
            }

            console.log('auth super :', token);

            if (user) {
                req.user = user
            }
        }

        next()
    }
}

export class AuthStoreMidlleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService
    ) { }

    async use(req: any, res: any, next: (error?: any) => void) {

        let [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (type === 'Bearer' && token) {
            let store = await this.prismaService.store.findFirst({
                where: {
                    accessToken: token,
                }
            })

            if (!store) {
                store = await this.prismaService.store.findFirst({
                    where: {
                        refreshToken: token,
                    }
                })
            }

            console.log('auth store :', token);

            if (store) {
                req.store = store
            }
        }

        next()
    }
}