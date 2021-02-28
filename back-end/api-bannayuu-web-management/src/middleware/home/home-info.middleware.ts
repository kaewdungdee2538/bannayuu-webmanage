
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class HomeInfoMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ){}
    use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check Home value  : ' + messageCheckvalue)
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
        if(!body.home_address)
            return this.errMessageUrilTh.errHomeAddressNotFound
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.home_address))
            return this.errMessageUrilTh.errHomeAddressProhibitSpecial
        return null;
    }
};