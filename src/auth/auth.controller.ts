import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authloginUserRequest } from 'model/auth.model';
import { Response } from 'express';
import { userCreateRequest } from 'model/user.model';

@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

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
        return this.authService.login(req, res)
    }

    @Post('/logout/user')
    async logoutUser() {
        
    }

    @Post('/logout/store')
    async logoutStore() {

    }
}
