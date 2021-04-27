import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class CarEditInfoMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check edit car by home value  : ' + messageCheckvalue)
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
        if(!body.remark)
            return this.errMessageUrilTh.errRemarkNofound;
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.remark))
            return this.errMessageUrilTh.errReamrkPohibitSpecial;
        else if (!body.home_car_id)
            return this.errMessageUrilTh.errHomeCarIdNotFound;
        else if(this.formatDataUtils.HaveSpecialFormat(body.home_car_id))
            return this.errMessageUrilTh.errHomeCarIdProhitbitSpecial;
        else if(!this.formatDataUtils.IsNumber(body.home_car_id))
            return this.errMessageUrilTh.errHomeCarIdNotNumber;
        return await this.checkHomeCarInBase(body);
    }

    async checkHomeCarInBase(body) {
        const company_id = body.company_id;
        const home_car_id = body.home_car_id;
        let sql = `select home_car_id from m_home_car
        where  company_id = $1 and home_car_id = $2;`
        const query = {
            text: sql
            , values: [company_id, home_car_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errHomeCarNotInBase;
        else return null;
    }
};

