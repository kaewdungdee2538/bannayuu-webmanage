
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Request } from 'express-serve-static-core'
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';

@Injectable()
export class AnnounceAddInterceptor implements NestInterceptor {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        // console.log(request.body)
        const errMessage = await this.CheckValues(request.body);
        if (errMessage) throw new StatusException(
            {
                error: errMessage
                , result: null
                , message: errMessage
                , statusCode: 200
            }, 200)
        else return next.handle();

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
}