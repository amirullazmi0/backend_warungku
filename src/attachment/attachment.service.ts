import {
  //  INestApplication,
  Injectable,
} from '@nestjs/common';
import { pathDocument, pathImage } from 'DTO/path';
// import { WebResponse } from 'DTO/globals.dto';
import * as mime from 'mime-types';
import { createFileFailed, createFileSuccess } from 'DTO/message';
import { ConfigService } from '@nestjs/config';
const fs = require('fs');
import ImageKit from "imagekit";

@Injectable()
export class AttachmentService {
  constructor(private configService: ConfigService) { }

  private publicKeyImageKit = process.env.PUBLIC_KEY_IMAGE_KIT
  private privateKeyImageKit = process.env.PRIVATE_KEY_IMAGE_KIT
  private urlImageKit = process.env.URL_IMAGE_KIT

  private imageKit = new ImageKit({
    publicKey: this.publicKeyImageKit,
    privateKey: this.privateKeyImageKit,
    urlEndpoint: this.urlImageKit,
  })

  async createImage(
    file: Express.Multer.File | Express.Multer.File[],
  ): Promise<{ success: boolean; message: string; path: string | string[] }> {
    try {
      let data: string | string[];
      const url = this.configService.get('DOMAIN_URL');

      const date = new Date();
      let path: string | string[];
      if (Array.isArray(file)) {
        const fileArray = [];
        file.map((item: Express.Multer.File) => {
          console.log(item);
          fileArray.push(item.originalname);
        });
        data = fileArray;
      } else {
        if (file.mimetype.startsWith('image/')) {
          const fileName = `IMG${date.getTime()}.${mime.extension(file.mimetype)}`;
          const fileLocation = `${pathImage}/${fileName}`;

          try {
            await fs.promises.writeFile(
              `./public/${fileLocation}`,
              file.buffer,
            );
            console.log(createFileSuccess);
          } catch (error) {
            console.log(createFileFailed);
            return;
          }
          path = `${url}/${fileLocation}`;
        } else {
          const fileName = `DC${date.getTime()}.${mime.extension(file.mimetype)}`;
          const fileLocation = `${pathDocument}/${fileName}`;

          try {
            await fs.promises.writeFile(
              `./public/${fileLocation}`,
              file.buffer,
            );
            console.log(createFileSuccess);
          } catch (error) {
            console.log(createFileFailed);
            return;
          }
          path = `${url}/${fileLocation}`;
        }
      }
      return {
        success: true,
        message: '',
        path: path,
      };
    } catch (error) { }
  }

  async saveFileImageKit({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder?: string;
  }): Promise<{ path: string }> {
    const imageSave = this.imageKit.upload({
      file: file.buffer,
      folder: `/shopowns${folder}`,
      fileName: file.originalname,
      extensions: [
        {
          name: 'google-auto-tagging',
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    })

    return {
      path: (await imageSave).url
    }
  }
}
