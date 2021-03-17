import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class ComplaintService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getComplaintNotApprove(body: any) {
        const company_id = body.company_id;
        const home_address = !body.home_address ? null : body.home_address;
        const head_text = !body.head_text ? null : body.head_text;
        const start_date = !body.start_date ? '' : body.start_date;
        const end_date = !body.end_date ? '' : body.end_date;
        let sql = `select hci_id,hci_code,to_char(hci_datetime,'DD/MM/YYYY HH24:MI:SS') as post_date,hci.home_id,home_address
        ,hci_header_text,hci_detail_text,hci_data,hci_picture_data->'img_complaint' as img_complaint
        ,hci_status
        from h_complaint_info hci
        left join m_home mh on hci.home_id = mh.home_id
        where hci.delete_flag ='N' and hci_status = 'N' and hci.company_id =$1
        and hci_datetime between $2 and $3
        `
        if (home_address) {
            sql += ` and mh.home_address = '${home_address}'`
        }
        if (head_text) {
            sql += ` and hci_header_text LIKE '%${head_text}%'`
        }
        sql += ' order by mh.home_address,hci_header_text,hci_datetime;'
        const query = {
            text: sql
            , values: [company_id,start_date,end_date]
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

    async getComplaintReceipt(body: any) {
        const company_id = body.company_id;
        const home_address = !body.home_address ? null : body.home_address;
        const head_text = !body.head_text ? null : body.head_text;
        const start_date = !body.start_date ? '' : body.start_date;
        const end_date = !body.end_date ? '' : body.end_date;
        let sql = `select hci_id,hci_code,to_char(hci_datetime,'DD/MM/YYYY HH24:MI:SS') as post_date,hci.home_id,mh.home_address
        ,hci_header_text,hci_detail_text,hci_data,hci_picture_data->'img_complaint' as img_complaint
        ,hci_remark,hci_status
        from h_complaint_info hci
        left join m_home mh on hci.home_id = mh.home_id
        where hci.delete_flag ='N' and hci_status in ('RECEIPT') and hci.company_id =$1
        and hci_datetime between $2 and $3
        `
        if (home_address) {
            sql += ` and mh.home_address = '${home_address}'`
        }
        if (head_text) {
            sql += ` and hci_header_text LIKE '%${head_text}%'`
        }
        sql += ' order by mh.home_address,hci_header_text,hci_datetime;'
        const query = {
            text: sql
            , values: [company_id,start_date,end_date]
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

    async getComplaintSuccess(body: any) {
        const company_id = body.company_id;
        const home_address = !body.home_address ? null : body.home_address;
        const head_text = !body.head_text ? null : body.head_text;
        const start_date = !body.start_date ? '' : body.start_date;
        const end_date = !body.end_date ? '' : body.end_date;
        let sql = `select hci_id,hci_code,to_char(hci_datetime,'DD/MM/YYYY HH24:MI:SS') as post_date,hci.home_id,mh.home_address
        ,hci_header_text,hci_detail_text,hci_data,hci_picture_data->'img_complaint' as img_complaint
        ,hci_remark,hci_status
        from h_complaint_info hci
        left join m_home mh on hci.home_id = mh.home_id
        where hci.delete_flag ='N' and hci_status not in ('N','RECEIPT') and hci.company_id =$1
        and hci_datetime between $2 and $3
        `
        if (home_address) {
            sql += ` and mh.home_address = '${home_address}'`
        }
        if (head_text) {
            sql += ` and hci_header_text LIKE '%${head_text}%'`
        }
        sql += ' order by mh.home_address,hci_header_text,hci_datetime;'
        const query = {
            text: sql
            , values: [company_id,start_date,end_date]
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

    async getComplaintByID(body: any) {
        const company_id = body.company_id;
        const hci_id = body.hci_id;
        let sql = `select hci_id,hci_code,to_char(hci_datetime,'DD/MM/YYYY HH24:MI:SS') as post_date,hci.home_id,mh.home_address
        ,hci_header_text,hci_detail_text,hci_data,hci_picture_data->'img_complaint' as img_complaint
        ,hci_remark,hci_status,company_name,to_char(hci.update_date,'DD/MM/YYYY HH24:MI:SS') as update_date
        from h_complaint_info hci
        left join m_home mh on hci.home_id = mh.home_id
        left join m_company mc on hci.company_id = mc.company_id
        where hci.delete_flag ='N' and hci.company_id =$1 and hci_id = $2 limit 1;`
        const query = {
            text: sql
            , values: [company_id, hci_id]
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
                    error: this.errMessageUtilsTh.errComplaintNotInBase,
                    result: null,
                    message: this.errMessageUtilsTh.errComplaintNotInBase,
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

    async saveComplaintReceipt(body: any, req: any) {
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hci_id = body.hci_id
        const hci_remark = body.hci_remark
        const employee_id = employeeObj.employee_id
        console.log({ body })
        let sql = `update h_complaint_info set
        hci_remark = $1,hci_status = 'RECEIPT'
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and hci_id = $4
        ;`
        const query = {
            text: sql
            , values: [
                hci_remark
                ,employee_id
                ,company_id
                ,hci_id
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

    async saveComplaintReject(body: any, req: any) {
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hci_id = body.hci_id
        const hci_remark = body.hci_remark
        const employee_id = employeeObj.employee_id
        console.log({ body })
        let sql = `update h_complaint_info set
        hci_remark = $1,hci_status = 'REJECT'
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and hci_id = $4
        ;`
        const query = {
            text: sql
            , values: [
                hci_remark
                ,employee_id
                ,company_id
                ,hci_id
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

    async saveComplaintSuccess(body: any, req: any) {
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hci_id = body.hci_id
        const hci_remark = body.hci_remark
        const employee_id = employeeObj.employee_id
        console.log({ body })
        let sql = `update h_complaint_info set
        hci_remark = $1,hci_status = 'Y'
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and hci_id = $4
        ;`
        const query = {
            text: sql
            , values: [
                hci_remark
                ,employee_id
                ,company_id
                ,hci_id
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
    
    async saveComplaintCancel(body: any, req: any) {
        const employeeObj = req.user.employee
        const company_id = body.company_id
        const hci_id = body.hci_id
        const hci_remark = body.hci_remark
        const employee_id = employeeObj.employee_id
        console.log({ body })
        let sql = `update h_complaint_info set
        hci_remark = $1,hci_status = 'CANCEL'
        ,update_by = $2,update_date = current_timestamp
        where company_id = $3 and hci_id = $4
        ;`
        const query = {
            text: sql
            , values: [
                hci_remark
                ,employee_id
                ,company_id
                ,hci_id
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
