import { Injectable } from '@nestjs/common';
import { pathImage } from 'model/path';
import { WebResponse } from 'model/web.model';
import * as mime from 'mime-types';
const fs = require('fs');
@Injectable()
export class AttachmentService {
    async createImage(file: Express.Multer.File | Express.Multer.File[]): Promise<{ success: boolean, message: string, path: string }> {
        try {
            let data: string | string[]
            const date = new Date
            if (Array.isArray(file)) {
                const fileArray = []
                file.map((item: Express.Multer.File) => {
                    console.log(item)
                    fileArray.push(item.originalname)
                })
                data = fileArray
            } else {
                if (file.mimetype.startsWith('image/')) {
                    const fileName = `IMG${date.getTime()}.${mime.extension(file.mimetype)}`;
                    const save = await fs.promises.writeFile(`${pathImage}/${fileName}`, file.buffer);
                }
            }

            return {
                success: true,
                message: '',
                path: ''
            }
        } catch (error) {

        }
    }
}
