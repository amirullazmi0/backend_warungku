import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authloginUserRequest } from 'model/auth.model';
import { Response } from 'express';

@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

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
}
