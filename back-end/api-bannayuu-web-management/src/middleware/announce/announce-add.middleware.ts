
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class AnnounceAddMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection:dbConnection,
    ){}
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware announce add  : ' + messageCheckvalue)
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
        if(!body.hni_name)
            return this.errMessageUrilTh.errAnnounceNameNotFound
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.hni_name))
            return this.errMessageUrilTh.errAnnounceNameProhibitSpecial
        else if(!body.hni_header_text)
            return this.errMessageUrilTh.errAnnounceHeaderNotFound
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.hni_header_text))
            return this.errMessageUrilTh.errAnnounceHeaderProhitbitSpecial
        else if(!body.hni_detail_text)
            return this.errMessageUrilTh.errAnnounceDetailNotFounce
        else if(this.formatDataUtils.HaveSpecialHomeFormat(body.hni_detail_text))
            return this.errMessageUrilTh.errAnnounceDetailProhibitSpecial
        return null;
    }

    
};