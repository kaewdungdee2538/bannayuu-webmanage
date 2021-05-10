import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class CartypeNameContractionEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check cartype name contraction edit value  : ' + messageCheckvalue)
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
            return this.errMessageUrilTh.errNameContractionIsNotEng;
        return await this.checkContractionCartypeInBase(body);
    }

    async checkContractionCartypeInBase(body) {
        const company_id = body.company_id;
        const name_contraction = body.name_contraction.toUpperCase();
        const cartype_id = body.cartype_id;
        let sql = `select cartype_id from m_cartype
        where delete_flag = 'N' and company_id = $1 and cartype_name_contraction = $2 
        and cartype_id != $3;`
        const query = {
            text: sql
            , values: [company_id, name_contraction,cartype_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errCartypeContactionIsDuplicateInBase;
        else return null;
    }

};

