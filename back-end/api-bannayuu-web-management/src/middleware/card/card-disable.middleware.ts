import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class DisableCardMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware disable card value  : ' + messageCheckvalue)
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
        return await this.checkCardIsUsing(body)
    }

    async checkCardIsUsing(body) {
        const company_id = body.company_id;
        const card_id = body.card_id
        let sql = `select card_id,status_flag from m_card
        where delete_flag = 'N' 
        and company_id = $1 
        and card_id = $2 
        ;`
        const query = {
            text: sql
            , values: [company_id, card_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errCardNotInBase;
        else if(res.result[0].status_flag.toUpperCase() === "Y")
            return this.errMessageUrilTh.errCardIsUsing;
        else return null;
    }
};

