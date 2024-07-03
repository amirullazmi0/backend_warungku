import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { randomUUID } from 'crypto';
import { emailIsUnique, getDataFailed, getDataSuccess, registerFailed, registerSuccess } from 'model/message';
import { userCRUDResponse, userCreateRequest, userCreateSchema } from 'model/user.model';
import { WebResponse } from 'model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async getData(id?: string): Promise<WebResponse<{ record: number | undefined; user: user[] | user; }>> {
    try {
      let user: user | user[];

      user = await this.prismaService.user.findMany({
        include: {
          roles: true,
          // transactions: true,
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
            transactions: true,
          },
        });
      }

      return {
        success: true,
        message: getDataSuccess,
        data: {
          record: Array.isArray(user) ? user.length : undefined,
          user: user
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
