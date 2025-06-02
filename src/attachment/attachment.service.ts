import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';

@Injectable()
export class AttachmentService {
  // private publicKeyImageKit = process.env.PUBLIC_KEY_IMAGE_KIT;
  // private privateKeyImageKit = process.env.PRIVATE_KEY_IMAGE_KIT;
  // private urlImageKit = process.env.URL_IMAGE_KIT;

  private imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  async saveFileImageKit({
    file,
    folder,
  }: {
    file: Express.Multer.File;
    folder?: string;
  }): Promise<{ path: string }> {
    const imageSave = this.imagekit.upload({
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
    });

    return {
      path: (await imageSave).url,
    };
  }
}
