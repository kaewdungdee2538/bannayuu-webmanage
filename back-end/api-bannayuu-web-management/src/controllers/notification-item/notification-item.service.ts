import { Body, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class NotificationItemService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getNotiItemAll(body:any){
        const company_id = body.company_id;
        let sql = `select count(*) as all from h_sos_info where sos_status = 'N' and delete_flag = 'N'
        and company_id = $1;`
        const query = {
            text: sql
            , values: [company_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error)
            throw new StatusException(
                {
                    error: res.error,
                    result: null,
                    message: this.errMessageUtilsTh.messageProcessFail,
                    statusCode: 200,
                },
                200);
        else
            throw new StatusException(
                {
                    error: null,
                    result: res.result[0],
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
    }
}
