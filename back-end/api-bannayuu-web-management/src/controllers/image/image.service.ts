import { Injectable,Request,Res } from '@nestjs/common';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import {configfile} from '../../conf/config.json'
import * as fs from 'fs';
import { StatusException } from 'src/utils/callback.status';
import { join } from 'path';
@Injectable()
export class ImageService {

    constructor(private readonly  errMessage: ErrMessageUtilsTH){}
    async getImageWithPathFile(path:any,@Res() res) {
        const image_path = path;
        const file = configfile.image_path + image_path;
        console.log(file);
        try{
            const data = fs.readFileSync(file);
            res.setHeader('Content-Type','image/png');
            return res.send(data)
        }catch(error){
            // throw new StatusException({
            //     error: JSON.stringify(error),
            //     result: null,
            //     message: this.errMessage.errImageGetFail,
            //     statusCode: 200
            // },200);
            const image_default =join(__dirname, '../../..', 'public\\images\\img_default.png');
            console.log('Not Image');
            console.log(image_default);
            const data = fs.readFileSync(image_default);
            res.setHeader('Content-Type','image/png');
            return res.send(data)
        }
      
    }
}
