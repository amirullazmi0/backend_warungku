import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginRequestDTO } from 'DTO/auth.dto';
import { Response } from 'express';
import { userCreateRequestDTO } from 'DTO/user.dto';
import { Auth } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { apiStore, apiUser } from 'src/cummon/url';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(`check-auth`)
  async checkAuth(@Auth() user: user) {
    return this.authService.checkAuth(user);
  }

  @Post(`register`)
  async register(@Body() body: userCreateRequestDTO) {
    return this.authService.register(body);
  }

  @Post(`login`)
  async login(
    @Body() req: AuthLoginRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req, res);
  }
}
