import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class PaymentManagementGetByidMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware payment management get middleware  : ' + messageCheckvalue)
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
        if (!body.tpcfi_id)
            return this.errMessageUrilTh.errPaymentCommonFeeIdNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.tpcfi_id))
            return this.errMessageUrilTh.errPaymentCommonFeeIdProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.tpcfi_id))
            return this.errMessageUrilTh.errPaymentCommonFeeIdNotNumber;
        return await this.checkPaymentHistoryByid(body);
    }

    async checkPaymentHistoryByid(body:any){
        const tpcfi_id = body.tpcfi_id;
        let sql = `select tpcfi_id,workflow_id::integer from t_payment_common_fee_info
        where delete_flag = 'N' and tpcfi_id = $1;`
        const query = {
            text:sql
            ,values:[tpcfi_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errPaymentCommonFeeIdNotInbase;
        else if(res.result.workflow_id > 1){
            return this.errMessageUrilTh.errPaymentCommonFeeIsPaymented
        }
            else return null;
    }

};