import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class SosSaveGetInfoById implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get sos save by id value  : ' + messageCheckvalue)
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
        if(!body.sos_remark)
            return this.errMessageUrilTh.errRemarkNofound;
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.sos_remark))
            return this.errMessageUrilTh.errReamrkPohibitSpecial
        else if (!body.sos_id)
            return this.errMessageUrilTh.errSosIdNotfound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.sos_id))
            return this.errMessageUrilTh.errSosIdProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.sos_id))
            return this.errMessageUrilTh.errSosIdNotNumber
        else return await this.checkSosInBase(body);
    }

    async checkSosInBase(body) {
        const company_id = body.company_id;
        const sos_id = body.sos_id;
        let sql = `select sos_id,sos_status from h_sos_info
        where delete_flag = 'N' and company_id = $1 and sos_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, sos_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errSosNotInbase;
        else if(res.result[0].sos_status.toUpperCase() === 'Y') 
            return this.errMessageUrilTh.errSosActionDuplicate;
        else return null;
    }

};

