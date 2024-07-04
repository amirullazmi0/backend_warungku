import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, Next } from "@nestjs/common";
import { storeUnauthorized, unAuthorized, userUnauthorized } from "model/message";

export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()

        const user = request.user

        if (user) {
            return user
        } else {
            throw new HttpException(userUnauthorized, HttpStatus.UNAUTHORIZED)
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