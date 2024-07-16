import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, AuthSuper, AuthUser } from 'src/cummon/auth.decorator';
import { user } from '@prisma/client';
import { userUpdateRequest } from 'model/user.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddressService } from 'src/address/address.service';
import { addressCreateRequest } from 'model/address.model';
import { apiUser } from 'src/cummon/url';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private addressService: AddressService
  ) { }

  @Get(`${apiUser}/list-user`)
  async getAll(
    @AuthSuper() user: user,
    @Query('id') id?: string,
  ) {
    return this.userService.getData(id);
  }

  @Get(`${apiUser}/profile`)
  async getProfile(
    @Auth() user: user,
  ) {
    return this.userService.getProfile(user);
  }

  @Put(`${apiUser}/:id/update`)
  async updateById(
    @AuthSuper() user: user,
    @Param('id') id: string,
    @Body() req: userUpdateRequest
  ) {
    return this.userService.updateUserbyId(id, req);
  }
  @Put(`${apiUser}/update/profile`)
  @UseInterceptors(FileInterceptor('images'))
  async updateUserProfile(
    @Auth() user: user,
    @Body() req: userUpdateRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false
        }),
    ) images?: Express.Multer.File,
  ) {
    return this.userService.updateUserProfile(user, req, images);
  }

  @Get(`${apiUser}/profile/address`)
  async getProfileAddress(
    @Auth() user: user,
  ) {
    return this.addressService.getAddress(user);
  }

  @Put(`${apiUser}/update/profile/address`)
  async updateProfileAddress(
    @Auth() user: user,
    @Body() req: addressCreateRequest
  ) {
    return this.addressService.updateAddressProfile(user, req)
  }
}
