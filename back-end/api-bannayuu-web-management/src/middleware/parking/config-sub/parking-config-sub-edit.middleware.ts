import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParkingConfigSubEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config sub create : ' + messageCheckvalue)
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
        if (!body.amount_value)
            return this.errMessageUrilTh.errAmountParkingNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.amount_value))
            return this.errMessageUrilTh.errAmountParkingProhibitSpecial;
        else if (!this.formatDataUtils.checkDayType(body.amount_value))
            return this.errMessageUrilTh.errAmountParkingNumber;
        return await this.checkIntervalBetweenInBaseIsDuplicateNotEqualCpsID(body);
    }

    async checkIntervalBetweenInBaseIsDuplicateNotEqualCpsID(body:any){
        const company_id = body.company_id;
        const cps_id = body.cps_id;
        const cph_id = body.cph_id;
        const start_interval = body.start_interval;
        const stop_interval = body.stop_interval;
        let sql = `select cps_id from m_calculate_parking_sub
        where delete_flag = 'N'
        and company_id = $1
        and cph_id = $2
        and ($3 between cps_start_interval and cps_stop_interval
            or
        $4 between cps_start_interval and cps_stop_interval)
        and cps_id != $5
        `;
        const query = {
            text:sql,
            values:[
                company_id,cph_id
                ,start_interval
                ,stop_interval
                ,cps_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errIntervalIsDuplicateInBase;
        else return false;
    }
  
};

