import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authloginUserRequest } from 'model/auth.model';
import { Response } from 'express';
import { userCreateRequest } from 'model/user.model';
import { storeCreateRequest } from 'model/store.model';
import { Auth } from 'src/cummon/auth.decorator';
import { WebResponse } from 'model/web.model';
import { user } from '@prisma/client';
import { apiStore, apiUser } from 'src/cummon/url';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get(`${apiUser}/auth/check-auth`)
    async checkAuth(
        @Auth() user: user
    ) {
        return this.authService.checkAuth(user)
    }

    @Post(`${apiUser}/auth/register`)
    async register(
        @Body() req: userCreateRequest,
    ) {
        return this.authService.register(req);
    }

    @Post(`${apiUser}/auth/register/super-admin-register`)
    async registerSuper(
        @Body() req: userCreateRequest,
    ) {
        return this.authService.registerSuper(req);
    }

    @Post(`${apiStore}/auth/register`)
    async registerStore(
        @Body() req: storeCreateRequest,
    ) {
        return this.authService.registerStore(req);
    }

    @Post(`${apiUser}/auth/login`)
    async login(
        @Body() req: authloginUserRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(req, res)
    }

    @Post(`${apiStore}/auth/login`)
    async loginStore(
        @Body() req: authloginUserRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.loginStore(req, res)
    }
}
