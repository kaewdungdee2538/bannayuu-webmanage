import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Observable } from 'rxjs';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';

@Injectable()
export class AnnounceEditInterceptor implements NestInterceptor {
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
        if (!body.hni_id)
            return this.errMessageUrilTh.errAnnounceIDNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.hni_id))
            return this.errMessageUrilTh.errAnnounceIDProhibitSpecial
        else if (!this.formatDataUtils.IsNumber(body.hni_id))
            return this.errMessageUrilTh.errAnnounceIDNotNumber
        return this.CheckAnnounce(body);
    }

    async CheckAnnounce(body: any) {
        const hni_id = body.hni_id;
        const company_id = body.company_id;
        let sql = `select hni_id from h_notification_info where delete_flag = 'N' and hni_id = $1 and company_id =$2;`
        const query = {
            text: sql
            , values: [hni_id, company_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errAnnounceNotInBase;
        else return null;
    }
}