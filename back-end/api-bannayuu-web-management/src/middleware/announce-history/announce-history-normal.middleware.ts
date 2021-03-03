
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class AnnounceHistoryNormalMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection:dbConnection,
    ){}
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware announce history normal  : ' + messageCheckvalue)
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
        if(!body._value)
            return this.errMessageUrilTh.errAnnounceValueNotFound
        else if(this.formatDataUtils.HaveSpecialFormat(body._value))
            return this.errMessageUrilTh.errAnnounceValueProhibitSpecial
        else if(!this.formatDataUtils.IsNumber(body._value))
            return this.errMessageUrilTh.errAnnounceValueNotNumber
        else if(!body._type)
            return this.errMessageUrilTh.errAnnounceTypeNotFound
        else if(this.formatDataUtils.HaveSpecialFormat(body._type))
            return this.errMessageUrilTh.errAnnounceTypeProhibitSpecial
        return null;
    }

    
};