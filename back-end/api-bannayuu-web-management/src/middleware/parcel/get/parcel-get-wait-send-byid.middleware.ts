import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParcelGetWaitSendByIDMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check get parcel get wait send by id value  : ' + messageCheckvalue)
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
        if (!body.tpi_id)
            return this.errMessageUrilTh.errParcelIDNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDProhitbitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDNotNumber;
        else return null;
    }

};

