import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FuncUtils } from 'src/utils/func.utils';

@Injectable()
export class ParkingConfigSubService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
        private readonly functionUtils: FuncUtils,
    ) { }

    async getParkingConfigSubAllByCphID(body: any) {
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        let sql = `select cps_id,cps_code,cph_id
        ,to_char(cps_start_interval,'HH24:MI:SS') as cps_start_interval
        ,to_char(cps_stop_interval,'HH24:MI:SS') as cps_stop_interval
        ,cps_amount_value,cps_status
        ,company_name
        from m_calculate_parking_sub mcps
        left join m_company mcp 
        on mcps.company_id = mcp.company_id
        where mcps.delete_flag = 'N'
        and mcps.company_id = $1 and cph_id = $2
        order by cps_start_interval
        ;`
        const query = {
            text: sql,
            values: [company_id, cph_id]
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

    async getParkingConfigSubByCpsID(body: any) {
        const company_id = body.company_id;
        const cps_id = body.cps_id;
        let sql = `select cps_id,cps_code
        ,mcpm.cpm_id,cpm_name_th,cpm_name_en
        ,mcps.cph_id,cph_name_th,cph_name_en
        ,cps_start_interval,cps_stop_interval
        ,cps_amount_value,cps_status
        ,cps_remark
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcps.create_by) as create_by
        ,to_char(mcps.create_date,'YYYY-MM-DD HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcps.update_by) as update_by
        ,to_char(mcps.update_date,'YYYY-MM-DD HH24:MI:ss') as update_date
        ,company_name
        from m_calculate_parking_sub mcps
        left join m_company mcp 
        on mcps.company_id = mcp.company_id
        left join m_calculate_parking_header mcph
        on mcps.cph_id = mcph.cph_id
        left join m_calculate_parking_master mcpm
        on mcph.cpm_id = mcpm.cpm_id
        where mcps.delete_flag = 'N'
        and mcps.company_id = $1 and cps_id = $2;`
        const query = {
            text: sql,
            values: [company_id, cps_id]
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

    async createParkingSubRecordByCphId(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cph_id = body.cph_id;
        const cps_start_interval = body.start_interval;
        const cps_stop_interval = body.stop_interval;
        const cps_amount_value = body.amount_value;
        const cpmObj = {
            company_id, cph_id
        }
        const line_no = await this.functionUtils.getLineNoFromCPSWithCPHID(cpmObj);
        let sql = `insert into m_calculate_parking_sub(
            cps_code
            ,cph_id,line_no
            ,cps_start_interval,cps_stop_interval
            ,cps_amount_value,cps_status
            ,create_date,create_by
            ,company_id
        ) values(
            fun_generate_uuid('CPS'||trim(to_char(${company_id},'000')),4)
            ,$1,$2
            ,$3,$4
            ,$5,'Y'
            ,current_timestamp,$6
            ,$7
            );`
        const query = {
            text: sql,
            values: [
                cph_id, line_no
                , cps_start_interval, cps_stop_interval
                , cps_amount_value
                , employee_id
                , company_id
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

    async editParkingSubRecordByCphId(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        // const cph_id = body.cph_id;
        const cps_id = body.cps_id;
        const cps_start_interval = body.start_interval;
        const cps_stop_interval = body.stop_interval;
        const cps_amount_value = body.amount_value;
        const remark = body.remark;
        let sql = `update m_calculate_parking_sub set
        cps_start_interval = $1,cps_stop_interval = $2
        ,cps_amount_value =$3
        ,cps_remark = $4
        ,update_by = $5,update_date = current_timestamp
        where company_id = $6 and cps_id = $7
        ;`
        const query = {
            text: sql,
            values: [
                cps_start_interval,cps_stop_interval
                ,cps_amount_value
                ,remark
                ,employee_id
                ,company_id,cps_id
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
    
    async disableParkingSubRecordByCphId(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cps_id = body.cps_id;
        const remark = body.remark;
        let sql = `update m_calculate_parking_sub set
        delete_flag = 'Y'
        ,cps_remark = $1
        ,delete_by = $2,delete_date = current_timestamp
        where company_id = $3 and cps_id = $4
        ;`
        const query = {
            text: sql,
            values: [
                remark
                ,employee_id
                ,company_id,cps_id
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
