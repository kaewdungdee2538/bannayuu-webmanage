
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class AnnounceEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware announce edit  : ' + messageCheckvalue)
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
        if (!body.hni_id)
            return this.errMessageUrilTh.errAnnounceIDNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.hni_id))
            return this.errMessageUrilTh.errAnnounceIDProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.hni_id))
            return this.errMessageUrilTh.errAnnounceIDNotNumber
        return this.CheckAnnounce(body);
    }

    async CheckAnnounce(body:any){
        const hni_id = body.hni_id;
        const company_id = body.company_id;
        let sql = `select * from h_notification_info where delete_flag = 'N' and hni_id = $1 and company_id =$2;`
        const query = {
            text:sql
            ,values:[hni_id,company_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errAnnounceNotInBase;
        else return null;
    }


};