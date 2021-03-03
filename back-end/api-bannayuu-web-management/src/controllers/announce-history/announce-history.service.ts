import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class AnnounceHistoryService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getNormal(body:any){
        const company_id = body.company_id;
        const _value = body._value;
        const _type = body._type;
        const _interval = `${_value} ${_type}`
        console.log(_interval)
        let sql = `select hni_id,ref_hni_id,hni_code,hni_name
        ,hni_header_text,hni_detail_text
        ,hni_link_text
        ,hni_data,hni_remark
        ,to_char(hni_start_datetime,'DD/MM/YYYY HH24:MI:SS') as hni_start_datetime
		,to_char(hni_end_datetime,'DD/MM/YYYY HH24:MI:SS') as hni_end_datetime
        ,to_char(create_date,'DD/MM/YYYY HH24:MI:SS') as create_date,create_by
        ,to_char(update_date,'DD/MM/YYYY HH24:MI:SS') as update_date,update_by
        ,case when delete_flag = 'Y' then 'banned'
		when current_timestamp < hni_start_datetime then 'pending'
        when current_timestamp > hni_end_datetime then 'posted'
        when current_timestamp between hni_start_datetime and hni_end_datetime then 'active'
        else 'other' end as status
        from h_notification_info
        where  company_id =$1
        and hni_start_datetime > (current_timestamp-interval '${_interval}')
        order by hni_start_datetime,hni_name,hni_header_text;`
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
                    result: res.result,
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
    }
}
