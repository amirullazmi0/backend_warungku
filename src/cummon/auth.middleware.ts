import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthMidlleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService
    ) { }

    async use(req: any, res: any, next: (error?: any) => void) {

        let [type, token] = req.headers.authorization?.split(' ') ?? [];

        // if (type === 'Bearer' && token) {
        //     const user = await this.prismaService.user.findFirst({
        //         where: {
        //             token: token
        //         }
        //     })

        //     console.log(token);


        //     if (user) {
        //         req.user = user
        //     }
        // }

        next()
    }
}