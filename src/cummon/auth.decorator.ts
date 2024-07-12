import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, Next } from "@nestjs/common";
import { user } from "@prisma/client";
import { storeUnauthorized, unAuthorized, userUnauthorized } from "model/message";

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const user: user = request.user

        if (user) {
            console.log();
            console.log(`\x1b[34mAuthorized :\x1b[0m \x1b[33m${user.email}\x1b[0m \x1b[32m[${user.rolesName}]\x1b[0m`);

            return user
        } else {
            throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED)
        }
    }
)

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const user: user = request.user

        if (user && user.rolesName === 'user') {
            console.log();
            console.log(`\x1b[34mAuthorized :\x1b[0m \x1b[33m${user.email}\x1b[0m \x1b[32m[${user.rolesName}]\x1b[0m`);
            return user
        } else {
            throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED)
        }
    }
)

export const AuthSuper = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {

        const request = context.switchToHttp().getRequest()

        const user: user = request.user

        if (user && user.rolesName === 'super') {
            console.log();
            console.log(`\x1b[34mAuthorized :\x1b[0m \x1b[33m${user.email}\x1b[0m \x1b[32m[${user.rolesName}]\x1b[0m`);
            return user
        } else {
            throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED)
        }
    }
)

export const AuthStore = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const store = request.store

        if (store) {
            return store
        } else {
            throw new HttpException(storeUnauthorized, HttpStatus.UNAUTHORIZED)
        }
    }
)
