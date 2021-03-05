
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class EstampAllMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware estamp all  : ' + messageCheckvalue)
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
        if (this.formatDataUtils.HaveSpecialFormat(body.license_plate))
            return this.errMessageUrilTh.errLicensePlateProhitbitSpecial;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.f_name))
            return this.errMessageUrilTh.errFirstNameProhitbitSpecial
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.l_name))
            return this.errMessageUrilTh.errLastNameProhitbitSpecial
        else if (body.home_id) {
            if (this.formatDataUtils.HaveSpecialFormat(body.home_id))
                return this.errMessageUrilTh.errHomeIdProhibitSpecial
            else if (!this.formatDataUtils.IsNumber(body.home_id))
                return this.errMessageUrilTh.errHomeIDNotNumber
            return await this.CheckHomeInBase(body)
        }

        return null;
    }

    async CheckHomeInBase(body:any){
        const company_id = body.company_id;
        const home_id = body.home_id;
        let sql = `select * from m_home where delete_flag ='N' and company_id=$1 and home_id =$2;`
        const query = {
            text:sql
            ,values:[company_id,home_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length === 0)
            return this.errMessageUrilTh.errHomeAddressNotInBase
        else return null
    }

};