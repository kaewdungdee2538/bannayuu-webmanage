import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class GetCartypeCategoryMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get category middleware value  : ' + messageCheckvalue)
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
        if (!body.cartype_category_id)
            return this.errMessageUrilTh.errCartypeCategoryIDNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cartype_category_id))
            return this.errMessageUrilTh.errCartypeCategoryIDProhitbitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.cartype_category_id))
            return this.errMessageUrilTh.errCartypeCategoryIDNotNumber;
        else return await this.checkCategoryInBase(body);
    }

    async checkCategoryInBase(body) {
        const company_id = body.company_id;
        const cartype_category_id = body.cartype_category_id;
        let sql = `select cartype_category_id from m_cartype_category
        where delete_flag = 'N' and company_id = $1 and cartype_category_id = $2 ;`
        const query = {
            text: sql
            , values: [company_id, cartype_category_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errCartypeCategoryIDNotInBase;
        else return null;
    }
};



