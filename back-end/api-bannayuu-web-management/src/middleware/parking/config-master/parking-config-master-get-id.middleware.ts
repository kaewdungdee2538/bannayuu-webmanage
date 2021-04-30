import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParkingConfigMasterGetIdMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config master value  : ' + messageCheckvalue)
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
        if (!body.cpm_id)
            return this.errMessageUrilTh.errCPMIDNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_id))
            return this.errMessageUrilTh.errCPMIDProhibitSpecial;
        else if(!this.formatDataUtils.IsNumber(body.cpm_id))
            return this.errMessageUrilTh.errCPMIDNotNumber;
        return await this.checkCPMInBase(body);
    }

    async checkCPMInBase(body) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `select cpm_id from m_calculate_parking_master
        where delete_flag = 'N' and company_id = $1 and cpm_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, cpm_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errCPMNotInbase;
        else return null;
    }

};

