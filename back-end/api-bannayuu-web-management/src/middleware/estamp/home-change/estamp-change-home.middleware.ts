import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import * as moment from 'moment';
@Injectable()
export class EstampChangeHomeMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get visitor record in not estamp  : ' + messageCheckvalue)
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
        if (!body.visitor_record_id)
            return this.errMessageUrilTh.errVisitorRecordIdNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.visitor_record_id))
            return this.errMessageUrilTh.errVisitorRecordIdProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.visitor_record_id))
            return this.errMessageUrilTh.errVisitorRecordIdNotNumber
        else {
            const checkVisitor = await this.checkVisitorRecordIn(body);
            if (checkVisitor)
                return checkVisitor;
            else {
                if (!body.home_id)
                    return this.errMessageUrilTh.errHomeIDNotFound;
                else if (this.formatDataUtils.HaveSpecialFormat(body.home_id))
                    return this.errMessageUrilTh.errHomeAddressProhibitSpecial
                else if (!this.formatDataUtils.IsNumber(body.home_id))
                    return this.errMessageUrilTh.errHomeIDNotNumber;
                else return await this.checkHomeIDInBase(body);
            }
        }
    }

    async checkVisitorRecordIn(body) {
        const company_id = body.company_id;
        const visitor_record_id = body.visitor_record_id;
        let sql = `select visitor_record_id,estamp_flag from t_visitor_record
        where action_out_flag = 'N' and company_id = $1 and visitor_record_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, visitor_record_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errVisitorRecordNotIn;
        else if (res.result[0].estamp_flag === 'Y')
            return this.errMessageUrilTh.errVisitorEstamped;
        else return null;
    }
    async checkHomeIDInBase(body) {
        const company_id = body.company_id;
        const home_id = body.home_id;
        let sql = `select home_id from m_home
        where delete_flag = 'N' and company_id = $1 and home_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, home_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errHomeAddressNotInBase;
        else return null;
    }
};

