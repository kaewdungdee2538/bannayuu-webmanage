import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import * as moment from 'moment';
@Injectable()
export class EstampGetRecordNotEstampMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get visitor record in not estamp  : ' + messageCheckvalue)
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
        if (!body.start_date)
            return this.errMessageUrilTh.errTimeStartNotFound;
        else if (!this.formatDataUtils.IsDateTimeFormat(body.start_date))
            return this.errMessageUrilTh.errTimeStartNotTimeFormat;
        else if (!body.end_date)
            return this.errMessageUrilTh.errTimeEndNotFound;
        else if (!this.formatDataUtils.IsDateTimeFormat(body.end_date))
            return this.errMessageUrilTh.errTimeEndNotTimeFormat;
        else if (moment(body.start_date) > moment(body.end_date))
            return this.errMessageUrilTh.errTimeStartOverTimeEnd;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.license_plate))
            return this.errMessageUrilTh.errLicensePlateProhitbitSpecial;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.f_name))
            return this.errMessageUrilTh.errFirstNameProhitbitSpecial;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.l_name))
            return this.errMessageUrilTh.errLastNameProhitbitSpecial;
        else if (body.home_address) {
            if (this.formatDataUtils.HaveSpecialHomeFormat(body.home_address))
                return this.errMessageUrilTh.errHomeAddressProhibitSpecial
            else return await this.checkHomeAddressInBase(body);
        } else return null;
    }

    async checkHomeAddressInBase(body) {
        const company_id = body.company_id;
        const home_address = body.home_address;
        let sql = `select home_id from m_home
        where delete_flag = 'N' and company_id = $1 and home_address = $2 ;`
        const query = {
            text: sql
            , values: [company_id, home_address]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errHomeAddressNotInBase;
        else return null;
    }
};

