import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import * as moment from 'moment'; 
@Injectable()
export class TimeMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check time  : ' + messageCheckvalue)
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
        if (!body.start_date)
            return this.errMessageUrilTh.errTimeStartNotFound
        else if (!await this.formatDataUtils.IsDateTimeFormat(body.start_date))
            return this.errMessageUrilTh.errTimeStartNotTimeFormat
        else if (!body.end_date)
            return this.errMessageUrilTh.errTimeEndNotFound
        else if(!await this.formatDataUtils.IsDateTimeFormat(body.end_date))
            return this.errMessageUrilTh.errTimeEndNotTimeFormat
        else if(moment(body.start_date)>moment(body.end_date))
            return this.errMessageUrilTh.errTimeStartOverTimeEnd;
        else if(moment(body.end_date).diff(moment(body.start_date),'days') > 31)
            return this.errMessageUrilTh.errTimeSearchOver31Days;
        return null;
    }
};

