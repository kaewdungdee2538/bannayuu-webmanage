import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParkingConfigHeaderFirstGetIdMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config header first get id value  : ' + messageCheckvalue)
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
        if (!body.cph_id)
            return this.errMessageUrilTh.errCPHIDNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cph_id))
            return this.errMessageUrilTh.errCPHIDProhibitSpecial;
        else if(!this.formatDataUtils.IsNumber(body.cph_id))
            return this.errMessageUrilTh.errCPHIDNotNumber;
        return await this.checkCPHFirstInBase(body);
    }

    async checkCPHFirstInBase(body) {
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        let sql = `select cph_id from m_calculate_parking_header
        where delete_flag = 'N' and cph_priority_no = 1
        and company_id = $1 and cph_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, cph_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errCPHNotInbase;
        else return null;
    }

};
