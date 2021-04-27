import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

//---------------------query for 
// select tpcfi_id,scfi_code from
// (select tpcfi_id,scfi_code,row_number() over(partition by scfi_code order by tpcfi_id desc) as rn from t_payment_common_fee_info ) t
// where rn =1 order by tpcfi_id

// select tpcfi_id,scfi_code from t_payment_common_fee_info
// where  tpcfi_id in (
// select max(tpcfi_id) from t_payment_common_fee_info group by scfi_code)

@Injectable()
export class PaymentManagementService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getPaymentManagementAll(body: any) {
        const company_id = body.company_id;
        const home_address = body.home_address;
        const payment_event_id = body.payment_event_id;
        const workflow_id_wait_payment  = 2;
        const workflow_id_wait_check = 3;
        const workflow_id_head_transfer = 1;
        const workflow_id_head_credit = 6;
        let sql = `select
        tpcfi_id,tpcfi_code,tpcfi.scfi_code,head_tpcfi_id,ref_tpcfi_id
        ,tpcfi.payment_type_id
        ,tpcfi.payment_event_id,mpe.payment_event_name
        ,tpcfi.workflow_id,mwf.workflow_name
        ,scfi.payment_amount,scfi.transaction_pay as status
        ,(select home_address from m_home_line _mhl left join m_home _mh on _mhl.home_id = _mh.home_id where _mhl.home_line_id = tpcfi.home_line_id) as home_address
        ,tpcfi.home_line_id,mhl.home_line_first_name,mhl.home_line_last_name
        ,to_char(tpcfi.create_date,'DD/MM/YYYY HH24:MI:ss') as create_date
        from t_payment_common_fee_info tpcfi 
        left join m_payment_event mpe 
        on tpcfi.payment_event_id = mpe.payment_event_id
        left join m_workflow mwf 
        on tpcfi.workflow_id = mwf.workflow_id
        left join m_home_line mhl
        on tpcfi.home_line_id = mhl.home_line_id
        left join schedule_common_fee_info scfi
        on tpcfi.scfi_code = scfi.scfi_code
        where tpcfi.delete_flag = 'N'
        and scfi.transaction_pay = 'N'
        and tpcfi.company_id = $1
        and tpcfi.workflow_id in ($2,$3,$4,$5)
        `
        if (home_address)
            sql += ` and tpcfi.home_line_id in (select home_line_id from m_home_line left join m_home on m_home_line.home_id = m_home.home_id where home_address = '${home_address}')`
        if (payment_event_id)
            sql += ` and tpcfi.payment_event_id = ${payment_event_id}`
        const query = {
            text: sql,
            values: [
                company_id,
                workflow_id_wait_payment,workflow_id_wait_check
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

    async getPaymentManagementById(body: any) {
        const company_id = body.company_id;
        const tpcfi_id = body.tpcfi_id;
        let sql = `select
        tpcfi_id,tpcfi_code,tpcfi.scfi_code,head_tpcfi_id,ref_tpcfi_id
        ,tpcfi.payment_type_id
        ,tpcfi.payment_event_id,mpe.payment_event_name
        ,tpcfi.payment_data->'obj_data'->>'images' as img_bill
        ,tpcfi.payment_data->'obj_data'->>'m_bank' as m_bank
        ,tpcfi.payment_data->'obj_data'->>'m_pickerdate' as payment_date
        ,tpcfi.payment_data->'obj_data'->>'m_pickertime' as payment_time
        ,tpcfi.workflow_id,mwf.workflow_name
        ,tpcfi.home_line_id,mhl.home_line_first_name,mhl.home_line_last_name
        ,(select home_address from m_home_line _mhl left join m_home _mh on _mhl.home_id = _mh.home_id where _mhl.home_line_id = tpcfi.home_line_id) as home_address
        ,tpcfi_remark
        ,scfi.payment_amount,scfi.transaction_pay as status
        ,(select concat(home_line_first_name,' ',home_line_last_name) from m_home_line where home_line_id = tpcfi.create_by::integer) as create_by
        ,to_char(tpcfi.create_date,'DD/MM/YYYY HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.update_by::integer) as update_by
        ,to_char(tpcfi.update_date,'DD/MM/YYYY HH24:MI:ss') as update_date
        ,tpcfi.delete_flag
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.delete_by::integer) as delete_by
        ,to_char(tpcfi.delete_date,'DD/MM/YYYY HH24:MI:ss') as delete_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = tpcfi.emp_id::integer) as check_by
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
        and scfi.transaction_pay = 'N'
        and tpcfi.company_id = $1
        and tpcfi_id = $2
        limit 1;`
        const query = {
            text: sql,
            values: [company_id, tpcfi_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error)
            throw new StatusException(
                {
                    error: res.error,
                    result: null,
                    message: this.errMessageUtilsTh.errPaymentCommonFeeIdNotInbaseOrPaymented,
                    statusCode: 200,
                },
                200);
        else if (res.error)
            throw new StatusException(
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

    async approvePaymentVillager(body: any, req: any) {
        const employeeObj = req.user.employee;
        // const workflow_payment_status = body.workflow_payment_status.toLowerCase() === "complete" ? 2 : 3;
        const workflow_id = '5' // ตรวจสอบใน base table m_workflow (ตรวจสอบสำเร็จ)
        const company_id = body.company_id;
        const tpcfi_id = body.tpcfi_id;
        const villager_payment_amount = body.villager_payment_amount;
        const remark = body.remark;
        const employee_id = employeeObj.employee_id;
        const scfi_code = body.scfi_code;
        let sql = `update t_payment_common_fee_info set
        workflow_id = $1,emp_id = $2
        ,update_by = $3,update_date = current_timestamp
        ,tpcfi_remark = $4
        where company_id = $5
        and tpcfi_id = $6;`
        const query = {
            text: sql,
            values: [
                workflow_id, employee_id,
                employee_id,
                remark,
                company_id, tpcfi_id,
            ]
        }

        let sql_schedule = `update schedule_common_fee_info set
        transaction_pay = 'Y',update_by = $1 ,update_date = current_timestamp
        where company_id = $2 and scfi_code = $3`
        const query_schedule = {
            text:sql_schedule,
            values:[employee_id,company_id,scfi_code]
        }
        const res = await this.dbconnecttion.savePgData([query,query_schedule]);
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

    async rejectPaymentVillager(body: any, req: any) {
        const workflow_id = '4' // ตรวจสอบใน base table m_workflow (ติดต่อเจ้าหน้าที่)
        const employeeObj = req.user.employee;
        const company_id = body.company_id;
        const tpcfi_id = body.tpcfi_id;
        const remark = body.remark;
        const employee_id = employeeObj.employee_id;

        let sql = `update t_payment_common_fee_info set
        workflow_id = $1,emp_id = $2
        ,update_by =$3,update_date = current_timestamp
        ,tpcfi_remark = $4
        where company_id = $5
        and tpcfi_id = $6;`
        const query = {
            text: sql,
            values: [
                workflow_id, employee_id,
                employee_id,
                remark,
                company_id, tpcfi_id,
            ]
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

}
