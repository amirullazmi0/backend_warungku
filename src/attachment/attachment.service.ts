import { INestApplication, Injectable } from '@nestjs/common';
import { pathImage } from 'model/path';
import { WebResponse } from 'model/web.model';
import * as mime from 'mime-types';
import { createFileFailed, createFileSuccess } from 'model/message';
const fs = require('fs');

@Injectable()
export class AttachmentService {
    constructor(
        // private app: INestApplication
    ) { }

    async createImage(file: Express.Multer.File | Express.Multer.File[]): Promise<{ success: boolean, message: string, path: string }> {
        try {
            let data: string | string[]
            const url = 'this.app.getUrl()'

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
                    const fileLocation = `${pathImage}/${fileName}`
                    try {
                        await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
                        console.log(createFileSuccess);

                    } catch (error) {
                        console.log(createFileFailed);
                        return
                    }
                    const path = `${url}/${fileLocation}/${fileName}`
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
