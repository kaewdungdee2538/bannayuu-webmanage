import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class GetLicensePlateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check license plate value  : ' + messageCheckvalue)
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
        if(!body.license_plate)
            return this.errMessageUrilTh.errLicensePlateNotFound;
        else if(this.formatDataUtils.HaveSpecialFormat(body.license_plate))
            return this.errMessageUrilTh.errLicensePlateProhitbitSpecial;
        return await this.checkLicensePlateInBase(body);
    }

    async checkLicensePlateInBase(body) {
        const company_id = body.company_id;
        const license_plate = body.license_plate;
        let sql = `select home_car_id from m_home_car
        where delete_flag = 'N' and company_id = $1 and home_car_license_plate = $2;`
        const query = {
            text: sql
            , values: [company_id, license_plate]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errLicensePlateIsDuplicateInBase;
        else return null;
    }


};

