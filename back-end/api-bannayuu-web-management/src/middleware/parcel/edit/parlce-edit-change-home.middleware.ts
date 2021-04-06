
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParcelEditChangeHomeById implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check search tpi_id  : ' + messageCheckvalue)
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
        if (!body.tpi_id)
            return this.errMessageUrilTh.errParcelIDNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDProhitbitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDNotNumber;
        else return this.checkParcelSended(body);
    }

    async checkParcelSended(body:any){
        const company_id = body.company_id;
        const tpi_id = body.tpi_id;
        let sql = `select tpi_id,tpi_status from t_parcel_info
        where delete_flag = 'N' and company_id = $1 and tpi_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, tpi_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errParcelNotInBase;
        else if(res.result[0].tpi_status.toLowerCase() !== 'send_parcel')
            return this.errMessageUrilTh.errParcelNotSendedStatus;
        else return null;
    }
};