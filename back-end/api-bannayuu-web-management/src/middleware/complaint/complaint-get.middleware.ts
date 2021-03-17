
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ComplaintGetMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware complaint get  : ' + messageCheckvalue)
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
        if (!body.hci_id)
            return this.errMessageUrilTh.errComplaintIDNotfound
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.hci_id))
            return this.errMessageUrilTh.errComplaintIDProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.hci_id))
            return this.errMessageUrilTh.errComplaintIDNotNumber
        return this.CheckComplaintInBase(body);
    }

    async CheckComplaintInBase(body: any) {
        const company_id = body.company_id
        const hci_id = body.hci_id
        let sql = `select hci_id from h_complaint_info
        where delete_flag = 'N' and company_id = $1 and hci_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, hci_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errComplaintNotInBase;
        else return null;
    }

};