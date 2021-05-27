import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Observable } from 'rxjs';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';
import * as sharp from 'sharp';
import { v1 as uuidv1 } from 'uuid';
import * as fs from 'fs'
import { getCurrentDatePathFileSave } from './uploadfile.middleware'
@Injectable()
export class ResizeImageInterceptor implements NestInterceptor {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const errMessage = await this.resizeImages(request.files.image);
        if (errMessage) throw new StatusException(
            {
                error: errMessage
                , result: null
                , message: this.errMessageUrilTh.errResizeImageFailed
                , statusCode: 200
            }, 200)
        else return next.handle();

    }


    async resizeImages(files) {
        try {
            // let data_res_error = format.create('200', true, "ไฟล์ไม่ครบตามกำหนด", "upload_images_fail")   
            // if (req.files.length <= 1) return         console.log(data_res_error);
            // files = [];
            await Promise.all(
                files.map(async file => {
                    const newFilename = `NEW${file.filename}`;
                    console.log(newFilename);
                    try {
                        await sharp(file.path)
                            .resize(600, 600, {
                                fit: 'contain'
                            })
                            .flatten({ background: '#ffffff' })
                            .sharpen()
                            .withMetadata()
                            .toFormat("png")
                            .jpeg({ quality: 90 })
                            .toFile(`${file.destination}/${newFilename}`);
                        files.shift();
                        files.push(`${(file.destination)}/${newFilename}`);
                        fs.unlinkSync(file.path)

                    } catch (err) {
                        console.log(err)
                        return err;
                    }

                })
            );
            return null;
        } catch (error) {
            return error
        }
    };

}

