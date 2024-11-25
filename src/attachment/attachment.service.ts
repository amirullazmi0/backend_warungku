import { INestApplication, Injectable } from '@nestjs/common';
import { pathDocument, pathImage } from 'DTO/path';
import { WebResponse } from 'DTO/globals.dto';
import * as mime from 'mime-types';
import { createFileFailed, createFileSuccess } from 'DTO/message';
import { ConfigService } from '@nestjs/config';
const fs = require('fs');

@Injectable()
export class AttachmentService {
    constructor(
        private configService: ConfigService
    ) { }

    async createImage(file: Express.Multer.File | Express.Multer.File[]): Promise<{ success: boolean, message: string, path: string | string[] }> {
        try {
            let data: string | string[]
            const url = this.configService.get('DOMAIN_URL')

            const date = new Date
            let path: string | string[]
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
                    path = `${url}/${fileLocation}`
                } else {
                    const fileName = `DC${date.getTime()}.${mime.extension(file.mimetype)}`;
                    const fileLocation = `${pathDocument}/${fileName}`

                    try {
                        await fs.promises.writeFile(`./public/${fileLocation}`, file.buffer);
                        console.log(createFileSuccess);

                    } catch (error) {
                        console.log(createFileFailed);
                        return
                    }
                    path = `${url}/${fileLocation}`
                }
            }
            return {
                success: true,
                message: '',
                path: path
            }
        } catch (error) {
        }
    }
}
