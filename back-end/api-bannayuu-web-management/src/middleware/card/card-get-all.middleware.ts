import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class GetCardAllMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get card all value  : ' + messageCheckvalue)
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
        if (body.card_code){
            if(this.formatDataUtils.HaveSpecialFormat(body.card_code))
                return this.errMessageUrilTh.errCardCodeProhibitSpecial;
            else if(!this.formatDataUtils.IsNumber(body.card_code))
                return this.errMessageUrilTh.errCardCodeNotNumber;
        }
        else if(body.card_name){
            if(this.formatDataUtils.HaveSpecialFormat(body.card_name))
                return this.errMessageUrilTh.errCardNameProhibitSpecial;
            else if(this.formatDataUtils.isNotCharacterEng(body.card_name))
                return this.errMessageUrilTh.errCardNameIsNotEngOrNumber
        }
        return null;
    }
};

