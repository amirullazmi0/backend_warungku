import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/address/address.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AddressService],
})
export class UserModule {}
