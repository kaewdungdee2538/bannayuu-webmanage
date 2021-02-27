import { Body, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class VillagerService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection) { }

    async getVillagerAllByHomeID(body:any){
        const company_id = body.company_id;
        const home_id = body.home_id
        let sql = `select 
        home_line_id,home_id
        ,home_line_code
        ,home_line_first_name,home_line_last_name
        ,home_line_mobile_phone
        ,home_line_remark
         from m_home_line
         where delete_flag = 'N'
         and company_id = $1
         and home_id = $2
         order by home_line_first_name,home_line_last_name,home_line_mobile_phone;`
         const query = {
             text:sql
             ,values:[company_id,home_id]
         }
         const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }
}
