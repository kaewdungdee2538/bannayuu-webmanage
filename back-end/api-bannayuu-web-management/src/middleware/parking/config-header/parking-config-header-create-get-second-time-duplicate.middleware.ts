import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
@Injectable()
export class ParkingConfigHeaderCreateGetSecondTimeIsDuplicateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config header second get time is duplicate value  : ' + messageCheckvalue)
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
        return await this.checkCPHSecondIsDuplicate(body);
    }

    async checkCPHSecondIsDuplicate(body: any) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        const cpm_id = body.cpm_id;
        const start_time_zone = body.start_time_zone;
        const stop_time_zone = body.stop_time_zone;
        let sql = `select cph_id from m_calculate_parking_header
            where delete_flag = 'N' and cph_priority_no != 1
            and company_id = $1 and cartype_id = $2 
            and cpm_id = $3
            and ($4 between time_zone_start and time_zone_stop
            or $5 between time_zone_start and time_zone_stop)
            ;`
        const query = {
            text: sql
            , values: [
                company_id, cartype_id
                ,cpm_id
                ,start_time_zone
                ,stop_time_zone
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errCPHSecondTimeZoneIsDuplicate;
        else return null;
    }

};

