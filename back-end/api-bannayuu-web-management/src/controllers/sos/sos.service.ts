import { Body, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class SosService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getSosInfoAll(body: any) {
        const company_id = body.company_id;
        const start_date = body.start_date;
        const end_date = body.end_date;
        const home_address = body.home_address ? body.home_address : '';
        let sql = `select sos_id,sos_code
        ,to_char(sos_datetime,'DD/MM/YYYY HH24:MI:SS') as sos_datetime
        ,ref_sos_id,hsi.home_id,mh.home_address,home_line_uuid
        ,sos_header_text,sos_detail_text
        ,sos_data,sos_picture_data
        ,sos_remark
        ,sos_status
        from h_sos_info hsi
        left join m_home mh on hsi.home_id = mh.home_id
        where hsi.delete_flag = 'N'
        and sos_status in ('N')
        and hsi.company_id = $1
        and sos_datetime between $2 and $3`
        if (home_address)
            sql += ` and mh.home_address = '${home_address}'`
        sql += ` order by mh.home_address,sos_datetime;`

        const query = {
            text: sql
            , values: [
                company_id
                , start_date, end_date
            ]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }


    async getSosInfoById(body: any) {
        const company_id = body.company_id;
        const sos_id = body.sos_id;
        let sql = `select sos_id,sos_code
        ,to_char(sos_datetime,'DD/MM/YYYY HH24:MI:SS') as sos_datetime
        ,ref_sos_id,hsi.home_id,mh.home_address,home_line_uuid
        ,sos_header_text,sos_detail_text
        ,sos_data,sos_picture_data
        ,sos_remark
        ,sos_status
        ,company_name
        from h_sos_info hsi
        left join m_home mh on hsi.home_id = mh.home_id
        left join m_company mc on hsi.company_id = mc.company_id
        where hsi.delete_flag = 'N'

        and hsi.company_id = $1
        and hsi.sos_id = $2
        order by mh.home_address,sos_datetime;`

        const query = {
            text: sql
            , values: [
                company_id
                , sos_id
            ]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: res.result[0],
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async getSosHistoryInfoAll(@Body() body) {
        const company_id = body.company_id;
        const start_date = body.start_date;
        const end_date = body.end_date;
        const home_address = body.home_address ? body.home_address : '';
        const status_type = body.status_type ? body.status_type : '';
        let sql = `select sos_id,sos_code
        ,to_char(sos_datetime,'DD/MM/YYYY HH24:MI:SS') as sos_datetime
        ,ref_sos_id,hsi.home_id,mh.home_address,home_line_uuid
        ,sos_header_text,sos_detail_text
        ,sos_data,sos_picture_data
        ,sos_remark
        ,sos_status
        from h_sos_info hsi
        left join m_home mh on hsi.home_id = mh.home_id
        where hsi.delete_flag = 'N'
        
        and hsi.company_id = $1
        and sos_datetime between $2 and $3`
        if (home_address)
            sql += ` and mh.home_address = '${home_address}'`
        if (status_type) {
            if (status_type !== 'all')
                sql += ` and sos_status in ('${status_type.toUpperCase()}') `
        }


        sql += ` order by mh.home_address,sos_datetime;`

        const query = {
            text: sql
            , values: [
                company_id
                , start_date, end_date
            ]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async saveCorporateReceive(body:any,req:any){
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const sos_remark = body.sos_remark;
        const sos_id = body.sos_id;

        let sql = `update h_sos_info set
        sos_status = 'Y'
        ,sos_remark = $1
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and sos_id = $4;`

        const query = {
            text:sql
            ,values:[sos_remark,employee_id,company_id,sos_id]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async saveCorporateReject(body:any,req:any){
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const sos_remark = body.sos_remark;
        const sos_id = body.sos_id;

        let sql = `update h_sos_info set
        sos_status = 'REJECT'
        ,sos_remark = $1
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and sos_id = $4;`

        const query = {
            text:sql
            ,values:[sos_remark,employee_id,company_id,sos_id]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }


    async getSosInfoLast(body: any) {
        const company_id = body.company_id;
        let sql = `select sos_id,sos_code
        ,to_char(sos_datetime,'DD/MM/YYYY HH24:MI:SS') as sos_datetime
        ,ref_sos_id,hsi.home_id,mh.home_address,home_line_uuid
        ,sos_header_text,sos_detail_text
        ,sos_data,sos_picture_data
        ,sos_remark
        ,sos_status
        ,company_name
        from h_sos_info hsi
        left join m_home mh on hsi.home_id = mh.home_id
        left join m_company mc on hsi.company_id = mc.company_id
        where hsi.delete_flag = 'N'
        and hsi.company_id = $1
        order by sos_datetime DESC
        limit 1;`

        const query = {
            text: sql
            , values: [
                company_id
            ]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: res.result[0],
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }
    
}
