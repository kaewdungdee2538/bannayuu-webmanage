import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
@Injectable()
export class ParkingConfigHeaderCreateGetFirstIsDuplicateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config header create first is duplicate value  : ' + messageCheckvalue)
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
        return await this.checkCPHFirstIsDuplicate(body);
    }

    async checkCPHFirstIsDuplicate(body: any) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        const cpm_id = body.cpm_id;
        let sql = `select cph_id from m_calculate_parking_header
            where delete_flag = 'N' and cph_priority_no = 1
            and company_id = $1 and cartype_id = $2 
            and cpm_id = $3;`
        const query = {
            text: sql
            , values: [
                company_id, cartype_id
                ,cpm_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errCPHFirstIsDuplicate;
        else return null;
    }

};

