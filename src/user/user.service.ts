import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';
import { dataNotFound, deleteDataFailed, deleteDataSuccess, emailIsUnique, fileMustImage, getDataFailed, getDataSuccess, updateDataFailed, updateDataSuccess } from 'DTO/message';
import { userCRUDResponse, userCreateRequest, userCreateSchema, userUpdateRequest, userUpdateSchema } from 'DTO/user.model';
import { WebResponse } from 'DTO/globals.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { AttachmentService } from 'src/attachment/attachment.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private attachmentService: AttachmentService
  ) { }

  async getData(id?: string): Promise<WebResponse<{ record: number | undefined; user: user[] | user; }>> {
    try {
      let user: user | user[];

      user = await this.prismaService.user.findMany({
        include: {
          // userAddress: {
          //   include: {
          //     address: true
          //   }
          // },
          // roles: true,
          // transactions: true,
        },
      });
      if (id) {
        user = await this.prismaService.user.findFirst({
          where: {
            id: id,
          },
          include: {
            // userAddress: {
            //   include: {
            //     address: true
            //   }
            // },
            // roles: true,
            // transactions: true,
          },
        });
      }

      return {
        success: true,
        message: getDataSuccess,
        data: {
          record: Array.isArray(user) ? user.length : undefined,
          user: user
        },
      };
    } catch (error) {
      return {
        success: false,
        message: getDataFailed,
        errors: error,
      };
    }
  }
  async getProfile(user: user): Promise<WebResponse<user>> {
    try {
      let profile = await this.prismaService.user.findFirst({
        where: { id: user.id },
        include: {
          address: true
          // roles: true,
          // transactions: true,
        },
      });

      return {
        success: true,
        message: getDataSuccess,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        message: getDataFailed,
        errors: error,
      };
    }
  }

  async updateUserbyId(id: string, req: userUpdateRequest): Promise<WebResponse<any>> {
    let user = await this.prismaService.user.findFirst({
      where: { id: id }
    })

    if (!user) {
      throw new NotFoundException(dataNotFound)
    }

    const validate = userCreateSchema.parse({
      email: req.email ? req.email : user.email,
      fullName: req.fullName ? req.fullName : user.fullName,
      addressId: req.addressId ? req.addressId : user.addressId
    })

    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: validate
    })
    try {
      return {
        success: true,
        message: updateDataSuccess,
        data: validate
      }
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        errors: error
      }
    }
  }

  async updateUserProfile(user: user, req: userUpdateRequest, images?: Express.Multer.File): Promise<WebResponse<any>> {
    try {
      let profile = await this.prismaService.user.findFirst({
        where: { id: user.id }
      })

      if (!profile) {
        throw new NotFoundException(dataNotFound)
      }

      let dataImages: string = undefined
      if (images) {
        if (images.mimetype.startsWith('image/')) {
          const saveImages = await this.attachmentService.createImage(images)
          dataImages = saveImages.path.toString()
        } else {
          throw new BadRequestException(fileMustImage)
        }
      }

      const validate = userUpdateSchema.parse({
        email: req.email ? req.email : user.email,
        fullName: req.fullName ? req.fullName : user.fullName,
        addressId: req.addressId ? req.addressId : user.addressId,
        images: dataImages ? dataImages : user.images
      })

      profile = await this.prismaService.user.update({
        where: { id: user.id },
        data: validate
      })
      return {
        success: true,
        message: updateDataSuccess,
        data: validate
      }
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        errors: error
      }
    }
  }

  async deleteUserById(id: string): Promise<WebResponse<{ message: string }>> {
    let user = await this.prismaService.user.findFirst({
      where: { id: id }
    })

    if (!user) {
      throw new NotFoundException(dataNotFound)
    }

    user = await this.prismaService.user.delete({
      where: { id: id }
    })

    try {
      return {
        success: true,
        message: deleteDataSuccess
      }
    } catch (error) {
      return {
        success: false,
        message: deleteDataFailed,
        errors: error
      }
    }
  }

  async updateImagesProfile(user: user, images?: Express.Multer.File): Promise<WebResponse<any>> {
    try {
      let dataImages: string = undefined

      if (images) {
        if (images.mimetype.startsWith('image/')) {
          const saveImages = await this.attachmentService.createImage(images)
          dataImages = saveImages.path.toString()
        } else {
          throw new BadRequestException(fileMustImage)
        }
      }

      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          images: dataImages
        }
      })

      return {
        success: true,
        message: updateDataSuccess,
      }
    } catch (error) {
      return {
        success: false,
        message: updateDataFailed,
        errors: error
      }
    }
  }
}
