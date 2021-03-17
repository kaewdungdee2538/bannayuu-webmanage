import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Request } from 'express-serve-static-core'
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';

@Injectable()
export class ParcelSendInterceptor implements NestInterceptor {
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
        // if (!file.image_parcel_send)
        //     return this.errMessageUrilTh.errImageParcelNotFound;
         if (!body.send_parcel_detail)
            return this.errMessageUrilTh.errSendParcelDetailNotfound;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.send_parcel_detail))
            return this.errMessageUrilTh.errSendParcelDetailProhitbitSpecial;
        else if(!body.tpi_id)
            return this.errMessageUrilTh.errParcelIDNotFound
        else if(this.formatDataUtils.HaveSpecialFormat(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDProhitbitSpecial
        else if(!this.formatDataUtils.IsNumber(body.tpi_id))
            return this.errMessageUrilTh.errParcelIDNotNumber;
        return await this.checkTPIInBase(body);
    }

   async checkTPIInBase(body:any){
       const tpi_id = body.tpi_id;
       const company_id = body.company_id;
       let sql = `select tpi_status,tpi_flag from t_parcel_info where delete_flag = 'N' and company_id = $1 and tpi_id = $2;`
        const query = {
            text:sql
            ,values:[company_id,tpi_id]
        }
       const res = await this.dbconnection.getPgData(query);
       if (res.error)
           return res.error
       else if (res.result.length === 0)
           return this.errMessageUrilTh.errParcelNotInBase;
        else if(res.result[0].tpi_flag.toUpperCase() === 'Y')
            return this.errMessageUrilTh.errParcelSuccessfully
        else if(res.result[0].tpi_status.toLowerCase() === 'send_parcel')
            return this.errMessageUrilTh.errParcelSending
       else return null;
   }

}