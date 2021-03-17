import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Request } from 'express-serve-static-core'
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';

@Injectable()
export class HomeInterceptor implements NestInterceptor {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        console.log(request.files)
        const errMessage = await this.checkInputValues(request);
        if (errMessage) throw new StatusException(
            {
                error: errMessage
                , result: null
                , message: errMessage
                , statusCode: 200
            }, 200)
        else return next.handle();

    }


    async checkInputValues(request: any) {
        const body = request.body;
        const file = request.files
        console.log(body)
        if (!body.home_address)
            return this.errMessageUrilTh.errHomeAddressNotFound
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.home_address))
            return this.errMessageUrilTh.errHomeIdProhibitSpecial
        return await this.CheckHomeInBase(body);

    }

    async CheckHomeInBase(body: any) {
        const company_id = body.company_id;
        const home_address = body.home_address;
        let sql = `select home_id from m_home where delete_flag = 'N' and company_id =$1 and home_address = $2;`
        const query = {
            text: sql
            , values: [company_id, home_address]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errHomeIDNotInDataBase;
        else return null;
    }

}