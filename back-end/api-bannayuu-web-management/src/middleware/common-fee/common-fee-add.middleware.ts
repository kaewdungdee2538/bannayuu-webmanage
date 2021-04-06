
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import * as moment from 'moment'; 

@Injectable()
export class CommonFeeAddMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware common fee add  : ' + messageCheckvalue)
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
        if (!body.square_value)
            return this.errMessageUrilTh.errSquareValueNotfound
        else if (this.formatDataUtils.HaveSpecialFormat(body.square_value))
            return this.errMessageUrilTh.errSquareValueProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.square_value))
            return this.errMessageUrilTh.errSquareValueNotNumber
        else if (!body.payment_amount)
            return this.errMessageUrilTh.errCommonPaymentAmountNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.payment_amount))
            return this.errMessageUrilTh.errCommonPaymentAmountProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.payment_amount))
            return this.errMessageUrilTh.errCommonPaymentAmountNotNumber
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.remark))
            return this.errMessageUrilTh.errReamrkPohibitSpecial;
        else if (!body.date_from)
            return this.errMessageUrilTh.errDateFormNotFound
        else if (!await this.formatDataUtils.IsDateTimeFormat(body.date_from))
            return this.errMessageUrilTh.errDateFormNotTimeFormat
        else if (!body.date_to)
            return this.errMessageUrilTh.errDateToNotFound;
        else if (!await this.formatDataUtils.IsDateTimeFormat(body.date_to))
            return this.errMessageUrilTh.errDateToNotTimeFormat
        else if (moment(body.date_from) > moment(body.date_to))
            return this.errMessageUrilTh.errDateFormIsOverDateTo;
        return null;
    }



};