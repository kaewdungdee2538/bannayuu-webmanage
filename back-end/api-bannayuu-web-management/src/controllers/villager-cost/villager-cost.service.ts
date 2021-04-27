import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CommonFeeService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async addCommonFee(body: any, req: any) {
        const employeeObj = req.user.employee;
        const company_id = body.company_id;
        const home_id = body.home_id;
        const date_from = body.date_from;
        const date_to = body.date_to;
        //-----------------payment_event_id เอามาจาก m_payment_event
        const payment_event_id = body.payment_event_id;
        const square_value = body.square_value;
        const payment_amount = body.payment_amount;
        const remark = body.remark;
        const employee_id = employeeObj.employee_id;
        let sql = `insert into schedule_common_fee_info(
            scfi_code,home_id,date_from,date_to
            ,payment_event_id,square_value,payment_amount
            ,scfi_remark
            ,create_by,create_date,company_id
        ) values(
            fun_generate_uuid('SCFI'||trim(to_char(${company_id},'000'))||trim(to_char(${home_id},'0000')),5)
            ,$1,$2,$3
            ,$4,$5,$6
            ,$7
            ,$8,current_timestamp
            ,$9
        )`;

        const query = {
            text: sql
            , values: [
                home_id, date_from, date_to
                , payment_event_id, square_value, payment_amount
                , remark
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
    async editCommonFee(body: any, req: any) {
        const employeeObj = req.user.employee;
        const company_id = body.company_id;
        const scfi_id = body.scfi_id;
        const home_id = body.home_id;
        const date_from = body.date_from;
        const date_to = body.date_to;
        const square_value = body.square_value;
        const payment_amount = body.payment_amount;
        const remark = body.remark;
        const payment_event_id = body.payment_event_id;
        const employee_id = employeeObj.employee_id;

        let sql = `update schedule_common_fee_info set
        home_id = $1,date_from = $2,date_to = $3
        ,square_value = $4,payment_amount = $5,scfi_remark = $6
        ,update_by = $7,update_date = current_timestamp
        ,payment_event_id = $8
        where company_id = $9
        and scfi_id = $10
        `;

        const query = {
            text: sql
            , values: [
                home_id, date_from, date_to
                , square_value, payment_amount
                , remark
                , employee_id
                , payment_event_id
                , company_id
                , scfi_id
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

    async cancelCommonFee(body: any, req: any) {
        const employeeObj = req.user.employee;
        const company_id = body.company_id;
        const scfi_id = body.scfi_id;
        const remark = body.remark;
        const employee_id = employeeObj.employee_id;
        let sql = `update schedule_common_fee_info set
        scfi_remark = $1,delete_flag = 'Y'
        ,delete_by = $2,delete_date = current_timestamp
        where company_id = $3
        and scfi_id = $4
        `;

        const query = {
            text: sql
            , values: [
                remark
                , employee_id
                , company_id
                , scfi_id
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

    async getCommonFeeNoPay(body: any) {
        const company_id = body.company_id;
        const home_address = body.home_address;
        let sql = `select scfi_id,scfi_code,scfi.home_id,home_address
        ,to_char(date_from,'DD/MM/YYYY') as date_from
        ,to_char(date_to,'DD/MM/YYYY') as date_to
        ,scfi.payment_event_id,mpe.payment_event_name,square_value,payment_amount
        from schedule_common_fee_info scfi
        left join m_home mh on scfi.home_id = mh.home_id
        left join m_payment_event mpe on scfi.payment_event_id = mpe.payment_event_id
        where scfi.delete_flag = 'N' and transaction_pay = 'N'
        and scfi.company_id = $1`
        if (home_address)
            sql += ` and mh.home_address LIKE '%${home_address}%'`
        sql += ` order by home_address,date_from,date_to;`
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

    async getCommonFeeHistory(body: any) {
        const company_id = body.company_id;
        const home_address = body.home_address;
        const search_type = body.search_type;
        const start_date = body.start_date;
        const end_date = body.end_date;
        const payment_event_id = body.payment_event_id;
        let sql = `select scfi_id,scfi_code,scfi.home_id,home_address
        ,to_char(date_from,'DD/MM/YYYY') as date_from
        ,to_char(date_to,'DD/MM/YYYY') as date_to
        ,scfi.payment_event_id,mpe.payment_event_name,payment_amount
        ,case when scfi.delete_flag = 'Y' then 'cancel'
        when transaction_pay = 'Y' then 'pay' else 'not' end as status
        from schedule_common_fee_info scfi
        left join m_home mh on scfi.home_id = mh.home_id
        left join m_payment_event mpe on scfi.payment_event_id = mpe.payment_event_id
        where (scfi.delete_flag = 'Y' or transaction_pay = 'Y')
        and scfi.company_id = $1`
        if (home_address)
            sql += ` and mh.home_address = '${home_address}'`
        if (search_type === 'start_date')
            sql += ` and date_from between $2 and $3`
        else
            sql += ` and date_to between $2 and $3`
        if(payment_event_id)
            sql += ` and scfi.payment_event_id = ${payment_event_id}`
        sql += ` order by home_address,date_from,date_to;`
        const query = {
            text: sql
            , values: [company_id, start_date, end_date]
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

    async getCommonFeeInfoById(body: any) {
        const scfi_id = body.scfi_id;
        const company_id = body.company_id;
        let sql = `select scfi_id,scfi_code,scfi.home_id,home_address
        ,to_char(date_from,'YYYY-MM-DD HH24:MI:SS') as date_from
        ,to_char(date_to,'YYYY-MM-DD HH24:MI:SS') as date_to,scfi.payment_event_id,mpe.payment_event_name,payment_amount,square_value
        ,to_char(scfi.create_date,'DD/MM/YYYY HH24:MI:SS') create_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.create_by) as create_by
        ,to_char(scfi.update_date,'DD/MM/YYYY HH24:MI:SS') as update_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.update_by) as update_by
        ,scfi_remark as remark
        ,to_char(scfi.delete_date,'DD/MM/YYYY HH24:MI:SS') as delete_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.delete_by) as delete_by
        ,company_name
        from schedule_common_fee_info scfi
        left join m_home mh on scfi.home_id = mh.home_id
        left join m_company mc on scfi.company_id = mc.company_id
        left join m_payment_event mpe on scfi.payment_event_id = mpe.payment_event_id
        where scfi.delete_flag = 'N'
        and scfi.company_id = $1
        and scfi_id = $2
        ;`
        const query = {
            text: sql
            , values: [company_id, scfi_id]
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
        else if (res.result.length === 0) throw new StatusException(
            {
                error: this.errMessageUtilsTh.errCommonFeeNotInBase,
                result: null,
                message: this.errMessageUtilsTh.errCommonFeeNotInBase,
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

    async getCommonFeeInfoByIdHistory(body: any) {
        const scfi_id = body.scfi_id;
        const company_id = body.company_id;
        let sql = `select scfi_id,scfi_code,scfi.home_id,home_address
        ,to_char(date_from,'DD/MM/YYYY') as date_from
        ,to_char(date_to,'DD/MM/YYYY') as date_to,scfi.payment_event_id,mpe.payment_event_name,payment_amount,square_value
        ,to_char(scfi.create_date,'DD/MM/YYYY HH24:MI:SS') create_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.create_by) as create_by
        ,to_char(scfi.update_date,'DD/MM/YYYY HH24:MI:SS') as update_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.update_by) as update_by
        ,scfi_remark as remark
        ,to_char(scfi.delete_date,'DD/MM/YYYY HH24:MI:SS') as delete_date
        ,(select CONCAT(first_name_th,' ',last_name_th) from m_employee where company_id =$1 and employee_id = scfi.delete_by) as delete_by
        ,company_name
        ,case when scfi.delete_flag = 'Y' then 'cancel'
        when transaction_pay = 'Y' then 'pay' else 'not' end as status
        from schedule_common_fee_info scfi
        left join m_home mh on scfi.home_id = mh.home_id
        left join m_company mc on scfi.company_id = mc.company_id
        left join m_payment_event mpe on scfi.payment_event_id = mpe.payment_event_id
        where
        scfi.company_id = $1
        and scfi_id = $2
        ;`
        const query = {
            text: sql
            , values: [company_id, scfi_id]
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
        else if (res.result.length === 0) throw new StatusException(
            {
                error: this.errMessageUtilsTh.errCommonFeeNotInBase,
                result: null,
                message: this.errMessageUtilsTh.errCommonFeeNotInBase,
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
