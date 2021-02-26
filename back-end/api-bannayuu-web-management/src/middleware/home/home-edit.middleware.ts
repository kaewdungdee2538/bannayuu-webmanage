
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class HomeEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ){}
    use(req: Request, res: Response, next: () => void) {
        console.log(req.user)
        const messageCheckvalue = this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check HomeID value  : ' + messageCheckvalue)
            res.send({
                response: {
                    error: messageCheckvalue
                    , result: null
                    , message: messageCheckvalue
                    , statusCode: 200
                }
            });
        } else
            next();
    }

    CheckValues(body: any) {
        if(!body.home_id)
            return this.errMessageUrilTh.errHomeIDNotFound
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.home_id))
            return this.errMessageUrilTh.errHomeIdProhibitSpecial
        else if(!this.formatDataUtils.IsNumber(body.home_id))
            return this.errMessageUrilTh.errHomeIDNotNumber
        return null;
    }
};