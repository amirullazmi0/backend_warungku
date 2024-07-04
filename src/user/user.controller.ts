import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthSuper, AuthUser } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  async getAll(
    @AuthSuper() user: user,
    @Query('id') id?: string,
  ) {
    return this.userService.getData(id);
  }
}
