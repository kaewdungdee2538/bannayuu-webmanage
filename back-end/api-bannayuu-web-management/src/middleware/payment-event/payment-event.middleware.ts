import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class PaymentEventMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware payment middleware  : ' + messageCheckvalue)
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
        if (!body.payment_event_id)
            return this.errMessageUrilTh.errPaymentEventIdNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.payment_event_id))
            return this.errMessageUrilTh.errPaymentEventIdProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.payment_event_id))
            return this.errMessageUrilTh.errPaymentEventIdNotNumber;
        return await this.checkPaymentEventID(body);
    }

    async checkPaymentEventID(body:any){
        const payment_event_id = body.payment_event_id;
        let sql = `select payment_event_id from m_payment_event 
        where delete_flag = 'N' and payment_event_id = $1;`
        const query = {
            text:sql
            ,values:[payment_event_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errPaymentEventIdNotInbase;
        else return null;
    }

};