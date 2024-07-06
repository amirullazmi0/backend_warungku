import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authloginUserRequest } from 'model/auth.model';
import { Response } from 'express';
import { userCreateRequest } from 'model/user.model';
import { storeCreateRequest } from 'model/store.model';
import { Auth } from 'src/cummon/auth.decorator';
import { WebResponse } from 'model/web.model';
import { user } from '@prisma/client';

@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get('/check-auth')
    async checkAuth(
        @Auth() user: user
    ) {
        return this.authService.checkAuth(user)
    }

    @Post('/register')
    async register(
        @Body() req: userCreateRequest,
    ) {
        return this.authService.register(req);
    }

    @Post('/register/super-admin-register')
    async registerSuper(
        @Body() req: userCreateRequest,
    ) {
        return this.authService.registerSuper(req);
    }

    @Post('/register/store')
    async registerStore(
        @Body() req: storeCreateRequest,
    ) {
        return this.authService.registerStore(req);
    }

    @Post('/login')
    async login(
        @Body() req: authloginUserRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(req, res)
    }

    @Post('/login/store')
    async loginStore(
        @Body() req: authloginUserRequest,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.loginStore(req, res)
    }
}
