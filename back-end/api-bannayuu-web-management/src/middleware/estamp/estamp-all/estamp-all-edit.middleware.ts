
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class EstampEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware estamp edit  : ' + messageCheckvalue)
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
        console.log({body})
        if (!body.visitor_record_id)
            return this.errMessageUrilTh.errVisitorRecordIdNotNumber
        else if (this.formatDataUtils.HaveSpecialFormat(body.visitor_record_id))
            return this.errMessageUrilTh.errVisitorRecordIdProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.visitor_record_id))
            return this.errMessageUrilTh.errVisitorRecordIdNotNumber
        else if (!body.visitor_record_code)
            return this.errMessageUrilTh.errVisitorRecord_CodeNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.visitor_record_code))
            return this.errMessageUrilTh.errVisitorRecord_CodeProhitbit
        else if (!body.estamp_flag)
            return this.errMessageUrilTh.errEstampNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.estamp_flag))
            return this.errMessageUrilTh.errEstampProhibitSpecial
        return await this.CheckRecordIn(body);
    }

    async CheckRecordIn(body: any) {
        const company_id = body.company_id;
        const visitor_record_id = body.visitor_record_id;
        let sql = `select 
        case when action_out_flag = 'N' then 'true' else 'false' end as checkin_flag
         from t_visitor_record where company_id=$1 and visitor_record_id =$2 limit 1;;`
        const query = {
            text: sql
            , values: [company_id, visitor_record_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errVisitorRecordNotIn
        else if (res.result.checkin_flag === 'false')
            return this.errMessageUrilTh.errVisitorRecordNotIn
        else return null
    }

};