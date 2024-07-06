import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, Next } from "@nestjs/common";
import { user } from "@prisma/client";
import { storeUnauthorized, unAuthorized, userUnauthorized } from "model/message";

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const user: user = request.user

        if (user) {
            console.log();
            console.log(`user authorized ${user.email}`);
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
            console.log(`user authorized ${user.email}`);
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
            console.log(`super user authorized ${user.email}`);
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

export const AuthUserStore = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const store = request.store
        const user = request.user

        if (store) {
            return { store, user }
        } else {
            throw new HttpException(unAuthorized, HttpStatus.UNAUTHORIZED)
        }
    }
)