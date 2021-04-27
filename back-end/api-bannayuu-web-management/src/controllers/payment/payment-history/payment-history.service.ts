import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import * as moment from 'moment';
@Injectable()
export class PaymentHistoryService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getPaymentHistoryAll(body: any) {
        const company_id = body.company_id;
        const start_date = body.start_date;
        const end_date = moment(body.end_date).set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
        const home_address = body.home_address;
        const payment_event_id = body.payment_event_id;
        const workflow_id_head_transfer = 1;
        const workflow_id_head_credit = 6;
        const workflow_id_wait_payment  = 2;
        const workflow_id_wait_check = 3;
        const workflow_id_send_contact_transfer = 4;
        const workflow_id_send_contact_credit =7;
        const workflow_id_success_transfer = 5;
        const workflow_id_success_credit = 8;
        const workflow_id_payment_failed = 9;
        let sql = `select
        tpcfi_id,tpcfi_code,tpcfi.scfi_code,head_tpcfi_id,ref_tpcfi_id
        ,tpcfi.payment_type_id
        ,tpcfi.payment_event_id,mpe.payment_event_name
        ,tpcfi.workflow_id,mwf.workflow_name
        ,scfi.payment_amount,scfi.transaction_pay
        ,(select home_address from m_home_line _mhl left join m_home _mh on _mhl.home_id = _mh.home_id where _mhl.home_line_id = tpcfi.home_line_id) as home_address
        ,tpcfi.home_line_id,mhl.home_line_first_name,mhl.home_line_last_name
        ,tpcfi.home_line_id,mhl.home_line_first_name,mhl.home_line_last_name
        ,to_char(tpcfi.create_date,'DD/MM/YYYY HH24:MI:ss') as create_date
        ,case when tpcfi.workflow_id in ($1) then 'failed' 
		when tpcfi.workflow_id in ($2,$3) then 'incompleted'
		when tpcfi.workflow_id in ($4,$5) then 'completed'
		else 'none' end as status
        from t_payment_common_fee_info tpcfi 
        left join m_payment_event mpe 
        on tpcfi.payment_event_id = mpe.payment_event_id
        left join m_workflow mwf 
        on tpcfi.workflow_id = mwf.workflow_id
        left join m_home_line mhl
        on tpcfi.home_line_id = mhl.home_line_id
        left join schedule_common_fee_info scfi
        on tpcfi.scfi_code = scfi.scfi_code
        where  tpcfi.company_id = $6
        and tpcfi.create_date between $7 and $8
        and tpcfi.workflow_id not in ($9,$10,$11,$12)
        and tpcfi.workflow_id is not null
        `
        if (home_address)
            sql += ` and tpcfi.home_line_id in (select home_line_id from m_home_line left join m_home on m_home_line.home_id = m_home.home_id where home_address = '${home_address}')`
        if (payment_event_id)
            sql += ` and tpcfi.payment_event_id = ${payment_event_id}`

        const query = {
            text: sql,
            values: [
                workflow_id_payment_failed
                ,workflow_id_send_contact_transfer,workflow_id_send_contact_credit
                ,workflow_id_success_transfer,workflow_id_success_credit
                ,company_id, start_date, end_date
                ,workflow_id_wait_payment,workflow_id_wait_check
                ,workflow_id_head_transfer,workflow_id_head_credit
            ]
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

    async getPaymentHistoryById(body: any) {
        const company_id = body.company_id;
        const tpcfi_id = body.tpcfi_id;
        const workflow_id_send_contact_transfer = 4;
        const workflow_id_send_contact_credit =7;
        const workflow_id_success_transfer = 5;
        const workflow_id_success_credit = 8;
        const workflow_id_payment_failed = 9;
        let sql = `select
        tpcfi_id,tpcfi_code,tpcfi.scfi_code,head_tpcfi_id,ref_tpcfi_id
        ,tpcfi.payment_type_id
        ,tpcfi.payment_event_id,mpe.payment_event_name
        ,tpcfi.payment_data->'obj_data'->>'images' as img_bill
        ,tpcfi.payment_data->'obj_data'->>'m_bank' as m_bank
        ,tpcfi.payment_data->'obj_data'->>'m_pickerdate' as payment_date
        ,tpcfi.payment_data->'obj_data'->>'m_pickertime' as payment_time
        ,tpcfi.payment_data->'obj_data'->'card'->>'bank' as credit_bank
        ,tpcfi.payment_data->'obj_data'->'card'->>'city' as credit_city
        ,tpcfi.payment_data->'obj_data'->'card'->>'name' as credit_name
        ,tpcfi.payment_data->'obj_data'->'card'->>'brand' as credit_brand
        ,tpcfi.payment_data->'obj_data'->'card'->>'financing' as credit_financing
        ,round(cast(tpcfi.payment_data->'obj_data'->>'funding_amount' as decimal)/100,2)  as credit_funding_amount
        ,tpcfi.workflow_id,mwf.workflow_name
        ,tpcfi.home_line_id,mhl.home_line_first_name,mhl.home_line_last_name
        ,(select home_address from m_home_line _mhl left join m_home _mh on _mhl.home_id = _mh.home_id where _mhl.home_line_id = tpcfi.home_line_id) as home_address
        ,tpcfi_remark
        ,scfi.payment_amount,scfi.transaction_pay
        ,(select concat(home_line_first_name,' ',home_line_last_name) from m_home_line where home_line_id = tpcfi.create_by::integer) as create_by
        ,to_char(tpcfi.create_date,'DD/MM/YYYY HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.update_by::integer) as update_by
        ,to_char(tpcfi.update_date,'DD/MM/YYYY HH24:MI:ss') as update_date
        ,tpcfi.delete_flag
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.delete_by::integer) as delete_by
        ,to_char(tpcfi.delete_date,'DD/MM/YYYY HH24:MI:ss') as delete_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.emp_id::integer) as check_by
        ,to_char(tpcfi.create_date,'DD/MM/YYYY HH24:MI:ss') as create_date
        ,case when tpcfi.workflow_id in ($1) then 'failed' 
		when tpcfi.workflow_id in ($2,$3) then 'incompleted'
		when tpcfi.workflow_id in ($4,$5) then 'completed'
		else 'none' end as status
        ,mc.company_name
        from t_payment_common_fee_info tpcfi 
        left join m_payment_event mpe 
        on tpcfi.payment_event_id = mpe.payment_event_id
        left join m_workflow mwf 
        on tpcfi.workflow_id = mwf.workflow_id
        left join m_home_line mhl
        on tpcfi.home_line_id = mhl.home_line_id
        left join schedule_common_fee_info scfi
        on tpcfi.scfi_code = scfi.scfi_code
        left join m_company mc
        on tpcfi.company_id = mc.company_id
        where tpcfi.delete_flag = 'N'
        and scfi.transaction_pay != 'N'
        and tpcfi.company_id = $6
        and tpcfi_id = $7
        limit 1;`
        const query = {
            text: sql,
            values: [
                workflow_id_payment_failed
                ,workflow_id_send_contact_transfer,workflow_id_send_contact_credit
                ,workflow_id_success_transfer,workflow_id_success_credit
                ,company_id, tpcfi_id
            ]
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
        else if(res.result.length === 0) throw new StatusException(
            {
                error: this.errMessageUtilsTh.errPaymentCommonFeeIdNotInbaseOrPaymented,
                result: null,
                message: this.errMessageUtilsTh.errPaymentCommonFeeIdNotInbaseOrPaymented,
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
