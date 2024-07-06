import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { authLoginRequestSchema, authLoginStoreResponse, authLoginUserResponse, authloginStoreRequest, authloginUserRequest } from 'model/auth.model';
import { accountNotRegister, authLoginFailed, authLoginSuccess, emailIsUnique, emailPassworWrong, registerFailed, registerSuccess, unAuthorized } from 'model/message';
import { WebResponse } from 'model/web.model';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { userCRUDResponse, userCreateRequest, userCreateSchema } from 'model/user.model';
import { randomUUID } from 'crypto';
import { storeCreateRequest, storeCreateSchema, storeCRUDResponse } from 'model/store.model';
import { user } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService
    ) { }

    async checkAuth(user: user): Promise<WebResponse<any>> {
        try {
            const auth = await this.prismaService.user.findFirst({
                where: { id: user.id }
            })

            if (!auth) {
                throw new UnauthorizedException(unAuthorized)
            }

            return {
                success: true,
                message: `Hi ${auth.fullName}`,
                data: {
                    user: {
                        id: auth.id,
                        email: auth.email,
                        fullName: auth.fullName,
                    }
                }
            }

        } catch (error) {
            return {
                success: false,
                message: unAuthorized,
                errors: error
            }
        }
    }

    async login(req: authloginUserRequest, res: Response): Promise<WebResponse<authLoginUserResponse>> {
        try {
            const validate = authLoginRequestSchema.parse({
                email: req.email,
                password: req.password
            })

            let user = await this.prismaService.user.findFirst({
                where: { email: validate.email }
            })

            if (!user) {
                throw new BadRequestException(accountNotRegister)
            }
            const isPasswordValid = await bcrypt.compare(req.password, user.password)

            if (!isPasswordValid) {
                throw new BadRequestException(emailPassworWrong)
            }

            const access_token = await this.jwtService.sign({
                email: user.email,
                roles: 'user'
            })

            user = await this.prismaService.user.update({
                where: { email: validate.email },
                data: {
                    accessToken: access_token
                }
            })

            const expirationTime = 7 * 24 * 60 * 60 * 1000;

            res.cookie('access-token', user.accessToken, {
                maxAge: expirationTime,
                httpOnly: true
            })

            return {
                success: true,
                message: authLoginSuccess,
                data: {
                    email: user.email,
                    fullName: user.fullName,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                }
            }
        } catch (error) {
            return {
                success: false,
                message: authLoginFailed,
                errors: error
            }
        }
    }

    async loginStore(req: authloginStoreRequest, res: Response): Promise<WebResponse<authLoginStoreResponse>> {
        try {
            const validate = authLoginRequestSchema.parse({
                email: req.email,
                password: req.password
            })

            let store = await this.prismaService.store.findFirst({
                where: { email: validate.email }
            })

            if (!store) {
                throw new BadRequestException(accountNotRegister)
            }
            const isPasswordValid = await bcrypt.compare(req.password, store.password)

            if (!isPasswordValid) {
                throw new BadRequestException(emailPassworWrong)
            }

            const access_token = await this.jwtService.sign({
                email: store.email,
                roles: 'user'
            })

            store = await this.prismaService.store.update({
                where: { email: validate.email },
                data: {
                    accessToken: access_token
                }
            })

            const expirationTime = 7 * 24 * 60 * 60 * 1000;

            res.cookie('access-token', store.accessToken, {
                maxAge: expirationTime,
                httpOnly: true
            })

            return {
                success: true,
                message: authLoginSuccess,
                data: {
                    email: store.email,
                    fullName: store.fullName,
                    accessToken: store.accessToken,
                    refreshToken: store.refreshToken
                }
            }
        } catch (error) {
            return {
                success: false,
                message: authLoginFailed,
                errors: error
            }
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
                    images: validate.images
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
                    images: validate.images
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

    async registerStore(req: storeCreateRequest): Promise<WebResponse<storeCRUDResponse>> {
        try {
            let refreshToken = this.jwtService.sign({
                email: req.email
            });


            const validate = storeCreateSchema.parse({
                email: req.email,
                fullName: req.fullName,
                password: req.password,
                address: req.address,
                logo: req.logo,
                bio: req.bio,
                refreshToken: refreshToken,
            });

            let id = randomUUID();

            const unique = await this.prismaService.store.findFirst({
                where: {
                    email: validate.email
                }
            })

            if (unique) {
                throw new ConflictException(emailIsUnique)
            }

            const bcryptPassword = await bcrypt.hash(validate.password, 10)

            const create = await this.prismaService.store.create({
                data: {
                    id: id,
                    email: validate.email,
                    fullName: validate.fullName,
                    password: bcryptPassword,
                    refreshToken: validate.refreshToken,
                    address: validate.address,
                    bio: validate.bio,
                    logo: validate.logo
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
