import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Next,
} from '@nestjs/common';
import { user } from '@prisma/client';
import { storeUnauthorized, unAuthorized, userUnauthorized } from 'DTO/message';

export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user: user = request.user;

    if (user) {
      console.log();
      console.log(
        `\x1b[34mAuthorized :\x1b[0m \x1b[33m${user.email}\x1b[0m \x1b[32m[${user.rolesName}]\x1b[0m`,
      );
      return user;
    } else {
      throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED);
    }
  },
);
