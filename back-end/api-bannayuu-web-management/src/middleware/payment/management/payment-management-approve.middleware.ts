import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class PaymentManagementApproveMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware payment approve  : ' + messageCheckvalue)
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
        if (!body.villager_payment_amount)
            return this.errMessageUrilTh.errVillagerPaymentAmountNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.villager_payment_amount))
            return this.errMessageUrilTh.errVillagerPaymentAmountProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.villager_payment_amount))
            return this.errMessageUrilTh.errVillagerPaymentAmountNotNumber;
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.remark))
            return this.errMessageUrilTh.errReamrkPohibitSpecial;
            return null;
    }

};