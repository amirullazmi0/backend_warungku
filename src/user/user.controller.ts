import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  async getAll(
    @Query('id') id?: string,
  ) {
    return this.userService.getData(id);
  }
}
