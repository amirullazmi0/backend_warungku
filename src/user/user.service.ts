import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import { getDataFailed, getDataSuccess, registerSuccess } from 'model/message';
import { userCreateRequest, userCreateSchema } from 'model/user.model';
import { WebResponse } from 'model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getData(
    id?: string,
  ): Promise<WebResponse<{ record: number | undefined; user: user[] | user }>> {
    try {
      let user: user | user[];
      user = await this.prismaService.user.findMany({
        include: {
          _count: true,
          roles: true,
          stores: true,
          transactions: true,
        },
      });
      if (id) {
        user = await this.prismaService.user.findFirst({
          where: {
            id: id,
          },
          include: {
            _count: true,
            roles: true,
            stores: true,
            transactions: true,
          },
        });
      }
      return {
        success: true,
        message: getDataSuccess,
        data: {
          record: Array.isArray(user) ? user.length : undefined,
          user: user,
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

  async register(req: userCreateRequest): Promise<WebResponse<user>> {
    let refreshToken = this.jwtService.signAsync({
      email: req.email,
      full: req.fullName,
    });

    const rolesName = 'user';

    const validate = userCreateSchema.parse({
      email: req.email,
      fullName: req.fullName,
      password: req.password,
      address: req.address,
      images: req.images,
      refreshToken: refreshToken,
    });

    let id = randomUUID();

    const create = await this.prismaService.user.create({
      data: {
        id: id,
        email: validate.email,
        fullName: validate.fullName,
        password: validate.password,
        refreshToken: validate.refreshToken,
        address: validate.address,
        rolesName: rolesName,
      },
    });
    return {
      success: true,
      message: registerSuccess,
      data: create,
    };
  }
}
