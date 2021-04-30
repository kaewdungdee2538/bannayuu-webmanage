import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
@Injectable()
export class TimeZoneMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check time zone : ' + messageCheckvalue)
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
        if (!body.start_time_zone)
            return this.errMessageUrilTh.errTimeZoneStartNotFound
        else if (!await this.formatDataUtils.IsTimeFormat(body.start_time_zone))
            return this.errMessageUrilTh.errTimeZoneStartNotTimeFormat
        else if (!body.stop_time_zone)
            return this.errMessageUrilTh.errTimeZoneEndNotFound
        else if(!await this.formatDataUtils.IsTimeFormat(body.stop_time_zone))
            return this.errMessageUrilTh.errTimeZoneEndNotTimeFormat
        else if(await this.formatDataUtils.isTimeStartOverTimeStop(body.start_time_zone,body.stop_time_zone))
            return this.errMessageUrilTh.errTimeZoneStartOverTimeEnd;
        return null;
    }
};

