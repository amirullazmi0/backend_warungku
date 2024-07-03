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
          _count: true,
          roles: true,
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

  async register(req: userCreateRequest): Promise<WebResponse<userCRUDResponse>> {
    try {
      let refreshToken = this.jwtService.sign({
        email: req.email
      });

      let rolesName = 'user';

      const validate = userCreateSchema.parse({
        email: req.email,
        fullName: req.fullName,
        password: req.password,
        address: req.address,
        images: req.images,
        rolesName: rolesName,
        refreshToken: refreshToken,
      });

      let id = randomUUID();

      const unique = await this.prismaService.user.findFirst({
        where: {
          email: validate.email
        }
      })

      if (unique) {
        throw new ConflictException(emailIsUnique)
      }

      const bcryptPassword = await bcrypt.hash(validate.password, 10)

      const create = await this.prismaService.user.create({
        data: {
          id: id,
          email: validate.email,
          fullName: validate.fullName,
          password: bcryptPassword,
          refreshToken: validate.refreshToken,
          address: validate.address,
          rolesName: rolesName,
        },
      });
      return {
        success: true,
        message: registerSuccess,
        data: {
          email: create.email,
          fullName: create.fullName,
          accessToken: create.accessToken,
          refreshToken: create.refreshToken
        },
      };
    } catch (error) {
      return {
        success: false,
        message: registerFailed,
        errors: error
      }
    }
  }

  async registerSuper(req: userCreateRequest): Promise<WebResponse<userCRUDResponse>> {
    try {
      let refreshToken = this.jwtService.sign({
        email: req.email
      });

      let rolesName = 'super';

      const validate = userCreateSchema.parse({
        email: req.email,
        fullName: req.fullName,
        password: req.password,
        address: req.address,
        images: req.images,
        rolesName: rolesName,
        refreshToken: refreshToken,
      });

      let id = randomUUID();

      const unique = await this.prismaService.user.findFirst({
        where: {
          email: validate.email
        }
      })

      if (unique) {
        throw new ConflictException(emailIsUnique)
      }

      const bcryptPassword = await bcrypt.hash(validate.password, 10)

      const create = await this.prismaService.user.create({
        data: {
          id: id,
          email: validate.email,
          fullName: validate.fullName,
          password: bcryptPassword,
          refreshToken: validate.refreshToken,
          address: validate.address,
          rolesName: rolesName,
        },
      });
      return {
        success: true,
        message: registerSuccess,
        data: {
          email: create.email,
          fullName: create.fullName,
          accessToken: create.accessToken,
          refreshToken: create.refreshToken
        },
      };
    } catch (error) {
      return {
        success: false,
        message: registerFailed,
        errors: error
      }
    }
  }
}
