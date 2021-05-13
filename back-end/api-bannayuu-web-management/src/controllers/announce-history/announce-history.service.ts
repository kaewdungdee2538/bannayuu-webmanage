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
    async getNormal(body: any) {
        const company_id = body.company_id;
        const start_date = !body.start_date ? '' : body.start_date;
        const stop_date = !body.stop_date ? '' : body.stop_date;
        let sql = `select hni_id,ref_hni_id,hni_code,hni_name
        ,hni_header_text,hni_detail_text
        ,hni_link_text
        ,hni_data,hni_remark
        ,to_char(hni_start_datetime,'YYYY-MM-DD HH24:MI:SS') as hni_start_datetime
		,to_char(hni_end_datetime,'YYYY-MM-DD HH24:MI:SS') as hni_end_datetime
        ,to_char(create_date,'YYYY-MM-DD HH24:MI:SS') as create_date,create_by
        ,to_char(update_date,'YYYY-MM-DD HH24:MI:SS') as update_date,update_by
        ,case when delete_flag = 'Y' then 'cancel'
		when current_timestamp < hni_start_datetime then 'pending'
        when current_timestamp > hni_end_datetime then 'posted'
        when current_timestamp between hni_start_datetime and hni_end_datetime then 'active'
        else 'other' end as status
        from h_notification_info
        where  company_id =$1
        and hni_start_datetime between $2 and $3
        order by hni_start_datetime,hni_name,hni_header_text;`
        const query = {
            text: sql
            , values: [company_id,start_date,stop_date]
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

    async getHistoryByid(body: any) {
        const company_id = body.company_id;
        const hni_id = body.hni_id;
        let sql = `select hni_id,ref_hni_id,hni_code,hni_name
        ,hni_header_text,hni_detail_text
        ,hni_link_text
        ,hni_data,hni_remark
        ,to_char(hni_start_datetime,'YYYY-MM-DD HH24:MI:SS') as hni_start_datetime
		,to_char(hni_end_datetime,'YYYY-MM-DD HH24:MI:SS') as hni_end_datetime
        ,to_char(hni.create_date,'YYYY-MM-DD HH24:MI:SS') as create_date,hni.create_by
        ,to_char(hni.update_date,'YYYY-MM-DD HH24:MI:SS') as update_date,hni.update_by
        ,case when hni.delete_flag = 'Y' then 'cancel'
		when current_timestamp < hni_start_datetime then 'pending'
        when current_timestamp > hni_end_datetime then 'posted'
        when current_timestamp between hni_start_datetime and hni_end_datetime then 'active'
        else 'other' end as status
        ,company_name
        from h_notification_info hni left join m_company mc
        on hni.company_id = mc.company_id
        where  hni.company_id =$1
        and hni_id =$2
       limit 1;`
        const query = {
            text: sql
            , values: [company_id, hni_id]
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
        else if (res.result.length === 0)
            throw new StatusException(
                {
                    error: this.errMessageUtilsTh.errAnnounceNotInBase,
                    result: null,
                    message: this.errMessageUtilsTh.errAnnounceNotInBase,
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
