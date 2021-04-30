import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
@Injectable()
export class ParkingConfigHeaderCreateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config header create value  : ' + messageCheckvalue)
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
        if (!body.interval_every)
            return this.errMessageUrilTh.errIntervalEveryNotFound;
        else if (!await this.formatDataUtils.IsTimeFormat(body.interval_every))
            return this.errMessageUrilTh.errIntercalEveryNotFormat;
        else if(!body.amount_value_for_cal)
            return this.errMessageUrilTh.errAmountValueForCalculateNotFound;
        else if(this.formatDataUtils.HaveSpecialFormat(body.amount_value_for_cal))
            return this.errMessageUrilTh.errAmountValueForCalculateProhibitSpecial;
        else if(!this.formatDataUtils.IsNumber(body.amount_value_for_cal))
            return this.errMessageUrilTh.errAmountValueForCalculateNotNumber;
        return null;
    }

};

