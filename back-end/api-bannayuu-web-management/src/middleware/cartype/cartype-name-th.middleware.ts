import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class CartypeNameTHMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check cartype name TH value  : ' + messageCheckvalue)
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

    async CheckValues(body: any) {
        if(!body.name_th)
            return this.errMessageUrilTh.errNameThNotFound;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.name_th))
            return this.errMessageUrilTh.errNameThProhitbitSpecial;
        return null;
    }

};

