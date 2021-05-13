import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class ParkingConfigMasterService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }



    async getParkingConfigMasterAll(body: any) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id ? body.cartype_id : null;
        let sql = `select cpm_id,cpm_code,cpm_name_th,cpm_name_en
        ,mc.cartype_name_th
        ,case when cpm_day_type = 'N' then 'วันปกติ'
        when cpm_day_type = 'SPECIAL' then 'วันพิเศษ'
        when cpm_day_type = 'WEEKEND' then 'วันหยุดสุดสัปดาห์'
        when cpm_day_type = 'HOLIDAY' then 'วันนักขัตฤกษ์'
        else 'อื่นๆ' end as day_type
        ,to_char(cpm_start_date,'YYYY-MM-DD HH24:MI:ss') as cpm_start_date
        ,to_char(cpm_stop_date,'YYYY-MM-DD HH24:MI:ss') as cpm_stop_date
        from m_calculate_parking_master mcpm
        left join m_cartype mc
        on mcpm.cartype_id = mc.cartype_id
        where mcpm.delete_flag = 'N' and mcpm.company_id = $1`
        if (cartype_id)
            sql += ` and mcpm.cartype_id = ${cartype_id}`
        sql += ` order by cartype_name_th,cpm_name_th`
        const query = {
            text: sql,
            values: [company_id]
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

    async getParkingConfigMasterById(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `select cpm_id,cpm_code,cpm_name_th,cpm_name_en
        ,mcpm.cartype_id,mc.cartype_name_th
        ,to_char(cpm_start_date,'YYYY-MM-DD HH24:MI:ss') as cpm_start_date
        ,to_char(cpm_stop_date,'YYYY-MM-DD HH24:MI:ss') as cpm_stop_date
        ,cpm_day_type
        ,to_char(cpm_time_for_free::time,'HH24:MI:ss') as cpm_time_for_free
        ,cpm_overnight_status
        ,to_char(cpm_overnight_start::time,'HH24:MI:ss') as cpm_overnight_start
        ,to_char(cpm_overnight_stop::time,'HH24:MI:ss') as cpm_overnight_stop
        ,cpm_fine_amount,cpm_remark
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcpm.create_by) as create_by
        ,to_char(mcpm.create_date,'YYYY-MM-DD HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcpm.update_by) as update_by
        ,to_char(mcpm.update_date,'YYYY-MM-DD HH24:MI:ss') as update_date
        ,company_name
        from m_calculate_parking_master mcpm
        left join m_cartype mc
        on mcpm.cartype_id = mc.cartype_id
        left join m_company mcp
        on mcpm.company_id = mcp.company_id
        where mcpm.delete_flag = 'N' and mcpm.company_id = $1
        and cpm_id = $2;`
        const query = {
            text: sql,
            values: [company_id, cpm_id]
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

    async createParkingMaster(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cpm_ref_id = body.cpm_ref_id;
        const cpm_name_th = body.name_th;
        const cpm_name_en = body.name_en;
        const cartype_id = body.cartype_id;
        const cpm_start_date = body.cpm_day_type === 'SPECIAL' ? body.start_date : null;
        const cpm_stop_date = body.cpm_day_type === 'SPECIAL' ? body.stop_date : null;
        const cpm_day_type = body.cpm_day_type;
        const cpm_time_for_free = body.cpm_time_for_free ? body.cpm_time_for_free : "00:00:00";
        const cpm_overnight_status = body.cpm_overnight_status ? body.cpm_overnight_status : 'N';
        const cpm_overnight_start = body.overnight_start ? body.overnight_start : "00:00:00";
        const cpm_overnight_stop = body.overnight_stop ? body.overnight_stop : "00:00:00";
        const cpm_fine_amount = body.cpm_fine_amount ? body.cpm_fine_amount : 0;

        let sql = `insert into m_calculate_parking_master(
            cpm_code
            ,cpm_ref_id,cpm_name_th,cpm_name_en,cartype_id
            ,cpm_start_date,cpm_stop_date,cpm_day_type,cpm_time_for_free
            ,cpm_overnight_status,cpm_overnight_start,cpm_overnight_stop,cpm_fine_amount
            ,create_date,create_by,company_id
        ) values(
            fun_generate_uuid('CPM'||trim(to_char(${company_id},'000')),4)
            ,$1,$2,$3,$4
            ,$5,$6,$7,$8
            ,$9,$10,$11,$12
            ,current_timestamp,$13,$14
        );`
        const query = {
            text: sql,
            values: [
                cpm_ref_id, cpm_name_th, cpm_name_en, cartype_id
                , cpm_start_date, cpm_stop_date, cpm_day_type, cpm_time_for_free
                , cpm_overnight_status, cpm_overnight_start, cpm_overnight_stop, cpm_fine_amount
                , employee_id, company_id
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

    async disableParkingConfigMaster(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cpm_id = body.cpm_id;
        const remark = body.remark;
        let sql1 = `update m_calculate_parking_master set
        delete_flag = 'Y',delete_date = current_timestamp
        ,cpm_remark = $4
        ,delete_by = $1
        where cpm_id = $2 and company_id = $3;`;
        const query1 = {
            text: sql1,
            values: [
                employee_id, cpm_id, company_id, remark
            ]
        }
        let sql2 = `update m_calculate_parking_header set
        delete_flag = 'Y',delete_date = current_timestamp
        ,cph_remark = $4
        ,delete_by = $1
        where cpm_id = $2 and company_id = $3;`;
        const query2 = {
            text: sql2,
            values: [
                employee_id, cpm_id, company_id, remark
            ]
        }
        let sql3 = `update m_calculate_parking_sub set
        delete_flag = 'Y',delete_date = current_timestamp
        ,cps_remark = $4
        ,delete_by = $1
        where cph_id in 
        (select cph_id from m_calculate_parking_header where cpm_id = $2 and company_id = $3)
        and company_id = $3;`;
        const query3 = {
            text: sql3,
            values: [
                employee_id, cpm_id, company_id, remark
            ]
        }

        const querys = [query1, query2, query3];
        const res = await this.dbconnecttion.savePgData(querys);
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

    async editParkingMasterInfo(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cpm_id = body.cpm_id;
        const cpm_name_th = body.name_th;
        const cpm_name_en = body.name_en;
        const cpm_start_date = body.cpm_day_type === 'SPECIAL' ? body.start_date : null;
        const cpm_stop_date = body.cpm_day_type === 'SPECIAL' ? body.stop_date : null;
        const cpm_day_type = body.cpm_day_type;
        const cpm_time_for_free = body.cpm_time_for_free ? body.cpm_time_for_free : "00:00:00";
        const cpm_overnight_status = body.cpm_overnight_status ? body.cpm_overnight_status : 'N';
        const cpm_overnight_start = body.overnight_start ? body.overnight_start : "00:00:00";
        const cpm_overnight_stop = body.overnight_stop ? body.overnight_stop : "00:00:00";
        const cpm_fine_amount = body.cpm_fine_amount ? body.cpm_fine_amount : 0;
        const remark = body.remark;
        let sql = `update m_calculate_parking_master set
        cpm_name_th = $1,cpm_name_en = $2
        ,cpm_start_date = $3,cpm_stop_date = $4
        ,cpm_day_type = $5,cpm_time_for_free = $6
        ,cpm_overnight_status = $7,cpm_overnight_start = $8,cpm_overnight_stop = $9
        ,cpm_fine_amount = $10,update_by = $11,update_date = current_timestamp
        ,cpm_remark = $12
        where company_id = $13 and cpm_id = $14
        ;`
        const query = {
            text: sql,
            values: [
                cpm_name_th, cpm_name_en
                , cpm_start_date, cpm_stop_date
                , cpm_day_type, cpm_time_for_free
                , cpm_overnight_status, cpm_overnight_start, cpm_overnight_stop
                , cpm_fine_amount, employee_id
                , remark
                , company_id, cpm_id
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
