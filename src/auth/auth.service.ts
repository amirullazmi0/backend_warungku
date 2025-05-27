import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  authLoginRequestSchema,
  authloginUserRequest,
  authLoginUserResponse,
} from 'DTO/auth.dto';
import {
  accountNotRegister,
  authLoginFailed,
  authLoginSuccess,
  emailIsUnique,
  emailPassworWrong,
  registerFailed,
  registerSuccess,
  unAuthorized,
} from 'DTO/message';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {
  userCRUDResponse,
  userCreateRequestDTO,
  userCreateSchema,
} from 'DTO/user.dto';
import { randomUUID } from 'crypto';
import { user } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async checkAuth(user: user): Promise<WebResponse<any>> {
    try {
      const auth = await this.prismaService.user.findFirst({
        where: { id: user.id },
      });

      if (!auth) {
        throw new UnauthorizedException(unAuthorized);
      }

      return {
        success: true,
        message: `Hi ${auth.fullName}`,
        data: {
          user: {
            id: auth.id,
            email: auth.email,
            fullName: auth.fullName,
            rolesName: auth.rolesName,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: unAuthorized,
        errors: error,
      };
    }
  }

  async login(req: authloginUserRequest): Promise<WebResponse<authLoginUserResponse>> {
    try {
      if (!req.email || !req.password) {
        throw new BadRequestException('Email and password are required');
      }

      const validate = authLoginRequestSchema.parse({
        email: req.email,
        password: req.password,
      });

      const user = await this.prismaService.user.findFirst({
        where: { email: validate.email },
      });

      if (!user || !user.password) {
        throw new BadRequestException(accountNotRegister);
      }

      const isPasswordValid = await bcrypt.compare(req.password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException(emailPassworWrong);
      }

      const access_token = await this.jwtService.sign({
        email: user.email,
        roles: 'user',
      });

      await this.prismaService.user.update({
        where: { email: validate.email },
        data: { accessToken: access_token },
      });

      // Jangan manipulate res di sini, biarkan controller yang handle response

      return {
        success: true,
        message: authLoginSuccess,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          accessToken: access_token,
          refreshToken: user.refreshToken,
        } as authLoginUserResponse,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // lempar ke controller untuk response error otomatis
      }
      console.error('Login error:', error);
      throw new BadRequestException(authLoginFailed);
    }
  }


  async register(
    body: userCreateRequestDTO,
  ): Promise<WebResponse<userCRUDResponse>> {
    try {
      const refreshToken = this.jwtService.sign({
        email: body.email,
      });

      const validate = userCreateSchema.parse({
        email: body.email,
        fullName: body.fullName,
        password: body.password,
        refreshToken: refreshToken,
      });

      const unique = await this.prismaService.user.findFirst({
        where: {
          email: validate.email,
        },
      });

      if (unique) {
        throw new ConflictException(emailIsUnique);
      }

      const userId = randomUUID();

      const bcryptPassword = await bcrypt.hash(validate.password, 10);

      const addressId = randomUUID();
      const createAddress = await this.prismaService.address.create({
        data: {
          id: addressId,
        },
      });

      const create = await this.prismaService.user.create({
        data: {
          id: userId,
          email: validate.email,
          fullName: validate.fullName,
          password: bcryptPassword,
          refreshToken: refreshToken,
          addressId: createAddress.id,
        },
      });

      await this.prismaService.userAddress.create({
        data: {
          userId: userId,
          addressId: addressId,
        },
      });

      return {
        success: true,
        message: registerSuccess,
        data: {
          email: create.email,
          fullName: create.fullName,
          accessToken: create.accessToken,
          refreshToken: create.refreshToken,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: registerFailed,
        errors: error,
      };
    }
  }

  async validateUserFromToken(accessToken: string): Promise<any> {
    try {
      const payload: JwtPayload = this.jwtService.verify(accessToken);
      return payload;
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
