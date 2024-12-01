import { Injectable, NotFoundException } from '@nestjs/common';
import { user } from '@prisma/client';
import {
  dataNotFound,
  getDataFailed,
  getDataSuccess,
  updateDataFailed,
  updateDataSuccess,
} from 'DTO/message';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { addressUpdateRequest, addressUpdateSchema } from 'DTO/address.dto';

@Injectable()
export class AddressService {
  constructor(private prismaService: PrismaService) {}

  async getAddress(user: user): Promise<WebResponse<any>> {
    try {
      const address = await this.prismaService.address.findFirst({
        where: { id: user.addressId },
      });

      if (!address) {
        throw new NotFoundException(dataNotFound);
      }

      return {
        success: true,
        message: getDataSuccess,
        data: address,
      };
    } catch (error) {
      return {
        success: false,
        message: getDataFailed,
        errors: error,
      };
    }
  }

  async updateAddressProfile(
    user: user,
    req: addressUpdateRequest,
  ): Promise<WebResponse<any>> {
    try {
      if (!user) {
        throw new NotFoundException(dataNotFound);
      }
      const validate = addressUpdateSchema.parse({
        active: req.active,
        jalan: req.jalan,
        rt: req.rt,
        rw: req.rw,
        kodepos: req.kodepos,
        kelurahan: req.kelurahan,
        kecamatan: req.kecamatan,
        kota: req.kota,
        provinsi: req.provinsi,
      });

      const update = await this.prismaService.address.update({
        where: { id: user.addressId },
        data: validate,
      });

      return {
        success: true,
        message: updateDataSuccess,
        data: update,
      };
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        errors: error,
      };
    }
  }
}
