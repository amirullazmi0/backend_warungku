import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { userCreateRequest } from 'model/user.model';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAll(@Param() id?: string) {
    return this.userService.getData(id);
  }

  @Post()
  async register(@Body() req: userCreateRequest) {
    // return this.userService.getData(id);
  }
}
