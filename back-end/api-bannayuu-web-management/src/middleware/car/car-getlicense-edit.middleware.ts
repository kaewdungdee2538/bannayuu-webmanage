import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class GetLicensePlateEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check license plate edit value  : ' + messageCheckvalue)
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
        return await this.checkLicensePlateInBaseAndCarIdNot(body);
    }

    async checkLicensePlateInBaseAndCarIdNot(body) {
        const company_id = body.company_id;
        const license_plate = body.license_plate;
        const home_car_id = body.home_car_id;
        let sql = `select home_car_id from m_home_car
        where delete_flag = 'N' and company_id = $1 and home_car_license_plate = $2 and home_car_id != $3;`
        const query = {
            text: sql
            , values: [company_id, license_plate,home_car_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errLicensePlateIsDuplicateInBase;
        else return null;
    }


};

