import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthUserMidlleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    let [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      let user = await this.prismaService.user.findFirst({
        where: { accessToken: token },
      });

      if (!user) {
        user = await this.prismaService.user.findFirst({
          where: { refreshToken: token },
        });
      }

      if (user) {
        user = await this.prismaService.user.update({
          where: { id: user.id },
          data: { lastActive: new Date() },
        });
        req.user = user;
      }
    }

    next();
  }
}
export class AuthStoreMidlleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    let [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      let store = await this.prismaService.store.findFirst({
        where: { accessToken: token },
      });

      if (!store) {
        store = await this.prismaService.store.findFirst({
          where: { refreshToken: token },
        });
      }

      if (store) {
        store = await this.prismaService.store.update({
          where: { id: store.id },
          data: { lastActive: new Date() },
        });
        req.store = store;
      }
    }

    next();
  }
}
