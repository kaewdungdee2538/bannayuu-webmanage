import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class GetCartypeMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get cartype value  : ' + messageCheckvalue)
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
        if (!body.cartype_id)
            return this.errMessageUrilTh.errGetCarTypeNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cartype_id))
            return this.errMessageUrilTh.errGetCarTypeProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.cartype_id))
            return this.errMessageUrilTh.errGetCarTypeNotNumber
        else return await this.checkCartypeBase(body);
    }

    async checkCartypeBase(body) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        let sql = `select cartype_id from m_cartype
        where delete_flag = 'N' and company_id = $1 and cartype_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, cartype_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errGetCartypeNotInBase;
        else return null;
    }


};

