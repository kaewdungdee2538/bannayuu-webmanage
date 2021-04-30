import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import * as moment from 'moment';
@Injectable()
export class DateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check date  : ' + messageCheckvalue)
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
        if (body.start_date) {
            if (!await this.formatDataUtils.IsDateTimeFormat(body.start_date))
                return this.errMessageUrilTh.errDateStartNotTimeFormat
            else if (!body.stop_date)
                return this.errMessageUrilTh.errDateStopNotFount
            else if (!await this.formatDataUtils.IsDateTimeFormat(body.stop_date))
                return this.errMessageUrilTh.errDateEndNotTimeFormat
            else if (moment(body.start_date) > moment(body.stop_date)){
                return this.errMessageUrilTh.errDateStartOverDateEnd;
            }
                
        }
        return null;

    }
};

