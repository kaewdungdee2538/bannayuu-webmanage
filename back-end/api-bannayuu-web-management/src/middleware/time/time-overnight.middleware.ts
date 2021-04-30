import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
@Injectable()
export class TimeOvernightMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check time overnight : ' + messageCheckvalue)
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
        if (body.overnight_start) {
            if (!await this.formatDataUtils.IsTimeFormat(body.overnight_start))
                return this.errMessageUrilTh.errTimeOverNightStartNotTimeFormat;
        }
        if (body.overnight_stop) {
            if (!await this.formatDataUtils.IsTimeFormat(body.overnight_stop))
                return this.errMessageUrilTh.errTimeOverNightEndNotTimeFormat;
        }
        return null;
    }
};

