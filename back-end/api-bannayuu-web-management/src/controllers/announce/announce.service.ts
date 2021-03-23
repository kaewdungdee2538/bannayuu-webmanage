import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class AnnounceService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getAnnounceAll(body: any) {
        const company_id = body.company_id;
        let sql = `select hni_id,ref_hni_id,hni_code,hni_name
        ,hni_header_text,hni_detail_text
        ,hni_link_text
        ,hni_data,hni_remark
        ,to_char(hni_start_datetime,'DD/MM/YYYY HH24:MI:SS') as hni_start_datetime
		,to_char(hni_end_datetime,'DD/MM/YYYY HH24:MI:SS') as hni_end_datetime
        ,to_char(create_date,'DD/MM/YYYY HH24:MI:SS') as create_date,create_by
        ,to_char(update_date,'DD/MM/YYYY HH24:MI:SS') as update_date,update_by
        ,case when current_timestamp < hni_start_datetime then 'pending'
        when current_timestamp > hni_end_datetime then 'posted'
        when current_timestamp between hni_start_datetime and hni_end_datetime then 'active'
        when delete_flag = 'Y' then 'cancel' else 'none' end as status
        from h_notification_info
        where delete_flag = 'N'
        and company_id =$1
        and current_timestamp < hni_end_datetime
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
    async addAnnounce(body: any, req: any) {
        const employeeObj = req.user.employee
        const hni_name = body.hni_name
        const ref_hni_id = body.ref_hni_id
        const hni_start_datetime = body.hni_start_datetime
        const hni_end_datetime = body.hni_end_datetime
        const hni_header_text = body.hni_header_text
        const hni_detail_text = body.hni_detail_text
        const hni_link_text = body.hni_link_text
        const hni_data = body.hni_data
        const hni_remark = body.hni_remark
        const employee_id = employeeObj.employee_id
        const company_id = body.company_id
        let sql = `insert into h_notification_info(
            hni_code
            ,ref_hni_id
            ,hni_name,hni_header_text
            ,hni_detail_text,hni_link_text,hni_remark
            ,hni_data
            ,hni_start_datetime,hni_end_datetime
            ,create_by,create_date
            ,company_id
        ) values(
            fun_generate_uuid('NT'||trim(to_char(${company_id},'000')),5)
            ,$1
            ,$2,$3
            ,$4,$5,$6
            ,$7
            ,$8,$9
            ,$10,current_timestamp
            ,$11
        );`

        const query = {
            text: sql
            , values: [
                ref_hni_id
                , hni_name, hni_header_text
                , hni_detail_text, hni_link_text, hni_remark
                , hni_data
                , hni_start_datetime, hni_end_datetime
                , employee_id
                , company_id
            ]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async getAnnounceByID(body:any,req:any){
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
        ,mc.company_name
        from h_notification_info hni
        left join m_company mc on hni.company_id = mc.company_id
        where hni.delete_flag = 'N'
        and hni.company_id =$1
        and hni.hni_id =$2
        limit 1;`
        const query = {
            text: sql
            , values: [company_id,hni_id]
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

    async editAnnounce(body:any,req:any){
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hni_id = body.hni_id;
        const hni_name = body.hni_name
        const ref_hni_id = body.ref_hni_id
        const hni_start_datetime = body.hni_start_datetime
        const hni_end_datetime = body.hni_end_datetime
        const hni_header_text = body.hni_header_text
        const hni_detail_text = body.hni_detail_text
        const hni_link_text = body.hni_link_text
        const hni_data = !body.hni_data ? null : body.hni_data
        const hni_remark = body.hni_remark
        const employee_id = employeeObj.employee_id
        console.log({body})
        let sql = `update h_notification_info set
        hni_name = $1, ref_hni_id = $2
        ,hni_start_datetime = $3,hni_end_datetime = $4
        ,hni_header_text = $5,hni_detail_text = $6
        ,hni_link_text = $7,hni_data = $8
        ,hni_remark = $9
        ,update_by = $10,update_date = current_timestamp
        where delete_flag = 'N'
        and hni_id = $11
        and company_id = $12
        ;`

        const query = {
            text: sql
            , values: [
                hni_name,ref_hni_id
                ,hni_start_datetime,hni_end_datetime
                ,hni_header_text,hni_detail_text
                ,hni_link_text,hni_data
                ,hni_remark
                ,employee_id
                ,hni_id
                ,company_id
            ]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async cancelAnnounce(body:any,req:any){
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hni_id = body.hni_id;
        const employee_id = employeeObj.employee_id
        let sql = `update h_notification_info set
        delete_flag = 'Y',delete_by = $1
        ,delete_date = current_timestamp
        where delete_flag = 'N'
        and hni_id = $2
        and company_id = $3
        ;`
        console.log(sql)
        const query = {
            text: sql
            , values: [
                employee_id
                ,hni_id
                ,company_id
            ]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }
}
