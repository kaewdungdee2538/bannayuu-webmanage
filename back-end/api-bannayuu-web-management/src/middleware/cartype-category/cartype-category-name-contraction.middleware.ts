import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class CartypeCategoryNameContractionCreateMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check category name contraction edit value  : ' + messageCheckvalue)
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
        if (!body.name_contraction)
            return this.errMessageUrilTh.errNameContractionNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.name_contraction))
            return this.errMessageUrilTh.errNameContractionProhitbitSpecial;
        else if (body.name_contraction.length > 4)
            return this.errMessageUrilTh.errNameContractionIsOver4Digit;
        else if(this.formatDataUtils.isNotCharacterEng(body.name_contraction))
            return this.errMessageUrilTh.errNameContractionIsNotEngOrNumber;
        return await this.checkContractionCategoryInBase(body);
    }

    async checkContractionCategoryInBase(body) {
        const company_id = body.company_id;
        const name_contraction = body.name_contraction.toUpperCase();
        let sql = `select cartype_id from m_cartype_category
        where delete_flag = 'N' and company_id = $1 and cartype_category_name_contraction = $2 
        ;`
        const query = {
            text: sql
            , values: [company_id, name_contraction]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errCartypeCategoryContactionIsDuplicateInBase;
        else return null;
    }
};
