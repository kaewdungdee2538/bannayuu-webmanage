
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class PaymentScheduleGetCodeMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware common fee get  : ' + messageCheckvalue)
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
        if (!body.scfi_code)
            return this.errMessageUrilTh.errCommonFeeCodeNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.scfi_code))
            return this.errMessageUrilTh.errCommonFeeCodeProhibitSpecial
        return await this.chekScfiInBase(body);
    }

    async chekScfiInBase(body:any){
        const company_id = body.company_id;
        const scfi_code = body.scfi_code;
        let sql = `select scfi_code,transaction_pay from schedule_common_fee_info 
        where company_id = $1 and scfi_code = $2`
        const query = {
            text:sql
            ,values:[company_id,scfi_code]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errCommonFeeNotInBase;
        else if(res.result[0].transaction_pay !== "N")
            return this.errMessageUrilTh.errCommonFeeIsPaymented;
        else return null;
    }
};