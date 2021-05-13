import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class EditCardMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware edit card value  : ' + messageCheckvalue)
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
       if (!body.card_name)
            return this.errMessageUrilTh.errCardNameNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.card_name))
            return this.errMessageUrilTh.errCardNameProhibitSpecial;
        else if (this.formatDataUtils.isNotCharacterEng(body.card_name))
            return this.errMessageUrilTh.errCardNameIsNotEngOrNumber
        return await this.checkCardNameInBase(body)
    }

    async checkCardNameInBase(body) {
        const company_id = body.company_id;
        const card_id = body.card_id
        const card_name = body.card_name;
        let sql = `select card_id,cardproblem_flag from m_card
        where delete_flag = 'N' 
        and company_id = $1 
        and card_name = $2 
        and card_id != $3
        ;`
        const query = {
            text: sql
            , values: [company_id, card_name, card_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return this.errMessageUrilTh.errCardNameIsDuplicateInBase;
        else return null;
    }
};

