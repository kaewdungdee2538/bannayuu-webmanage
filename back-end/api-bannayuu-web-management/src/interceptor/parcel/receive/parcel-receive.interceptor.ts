import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ErrMessageUtilsTH } from "src/utils/err_message_th.utils";
import { FormatDataUtils } from "src/utils/format_data.utils";
import { Request } from 'express-serve-static-core'
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StatusException } from 'src/utils/callback.status';
import { dbConnection } from 'src/pg_database/pg.database';

@Injectable()
export class ParcelReceiveInterceptor implements NestInterceptor {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
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
        // if (!file.image_parcel_receive)
        //     return this.errMessageUrilTh.errImageParcelNotFound;
         if (!body.tpi_title)
            return this.errMessageUrilTh.errParcelReceiveTitleNotFound;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.tpi_title))
            return this.errMessageUrilTh.errParcelReceiveTitleProhitbitSpecial;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.tpi_detail))
            return this.errMessageUrilTh.errParcelRecieveDetailProhibitSpecial
        else if (!body.receive_parcel_detail)
            return this.errMessageUrilTh.errReceiveParcelDetailNotFound;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.receive_parcel_detail))
            return this.errMessageUrilTh.errRecieveParcelDetailProhibitSpecial;
        return null;
    }

   

}