
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ComplaintGetTimeMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware complaint get  : ' + messageCheckvalue)
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
        const timestart = await this.formatDataUtils.IsDateTimeFormat(body.start_date)
        console.log(timestart)
        if (!body.start_date)
            return this.errMessageUrilTh.errTimeStartNotFound
        else if (!timestart)
            return this.errMessageUrilTh.errTimeStartNotTimeFormat
        else if (!body.end_date)
            return this.errMessageUrilTh.errTimeEndNotFound;
        else if (!await this.formatDataUtils.IsDateTimeFormat(body.end_date))
            return this.errMessageUrilTh.errTimeEndNotTimeFormat;
        return null
    }


};