import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, AuthSuper, AuthUser } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { userUpdateRequest } from 'model/user.model';

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
  @Get('/profile')
  async getProfile(
    @Auth() user: user,
  ) {
    return this.userService.getProfile(user);
  }

  @Put('/:id/update')
  async updateById(
    @AuthSuper() user: user,
    @Param('id') id: string,
    @Body() req: userUpdateRequest
  ) {
    return this.userService.updateUserbyId(id, req);
  }
  @Put('/update/profile')
  async updateUserProfile(
    @Auth() user: user,
    @Body() req: userUpdateRequest
  ) {
    return this.userService.updateUserProfile(user, req);
  }
}
