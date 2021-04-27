import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CalculateParkingService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getCalculateParkingMasterSettingAll(body: any) {
        const company_id = body.company_id;
        let sql = `select cpm_id,cpm_code
        ,cpm_name_th,cpm_name_en
        ,mcpm.cartype_id,mc.cartype_name_th
        ,cpm_start_date,cpm_stop_date
        ,cpm_time_for_free
        ,cpm_day_type
        ,cpm_overnight_status
        ,cpm_overnight_start,cpm_overnight_stop
        ,cpm_fine_amount
        ,mcpm.create_by
        ,(select concat(em.first_name_th,' ',em.last_name_th) from m_employee em where em.employee_id = mcpm.create_by) as create_by
        ,mcpm.create_date
        ,(select concat(em.first_name_th,' ',em.last_name_th) from m_employee em where em.employee_id = mcpm.update_by) as update_by
        ,mcpm.update_date
        ,mcp.company_name
        from m_calculate_parking_master mcpm
        left join m_cartype mc on mcpm.cartype_id = mc.cartype_id
        left join m_company mcp on mcpm.company_id = mcp.company_id
        where mcpm.delete_flag = 'N'
        and mcpm.company_id = $1
        order by mc.cartype_name_th,cpm_name_th;`
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

    async getCalculateParkingMasterSettingByID(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `select cpm_id,cpm_code
        ,cpm_name_th,cpm_name_en
        ,mcpm.cartype_id,mc.cartype_name_th
        ,cpm_start_date,cpm_stop_date
        ,cpm_time_for_free
        ,cpm_day_type
        ,cpm_overnight_status
        ,cpm_overnight_start,cpm_overnight_stop
        ,cpm_fine_amount
        ,mcpm.create_by
        ,(select concat(em.first_name_th,' ',em.last_name_th) from m_employee em where em.employee_id = mcpm.create_by) as create_by
        ,mcpm.create_date
        ,(select concat(em.first_name_th,' ',em.last_name_th) from m_employee em where em.employee_id = mcpm.update_by) as update_by
        ,mcpm.update_date
        ,mcp.company_name
        from m_calculate_parking_master mcpm
        left join m_cartype mc on mcpm.cartype_id = mc.cartype_id
        left join m_company mcp on mcpm.company_id = mcp.company_id
        where mcpm.delete_flag = 'N'
        and mcpm.company_id = $1
        and mcpm.cpm_id = $2
        order by mc.cartype_name_th,cpm_name_th;`
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

    async addCalculateParkingMaster(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cpm_name_th = body.cpm_name_th;
        const cpm_name_en = body.cpm_name_en;
        const cartype_id = body.cartype_id;
        const cpm_day_type = body.cpm_day_type;
        const start_date = cpm_day_type.toUpperCase() === 'SPECIAL' ? body.start_date : null;
        const stop_date = cpm_day_type.toUpperCase() === 'SPECIAL' ? body.stop_date : null;
        const cpm_overnight_status = body.cpm_overnight_status;
        const over_night_start = body.over_night_start;
        const over_night_stop = body.over_night_stop;
        const cpm_fine_amount = body.cpm_fine_amount;
        const cpm_time_for_free = body.cpm_time_for_free;

        let sql = `insert into m_calculate_parking_master(
            cpm_code,cpm_name_th,cpm_name_en,cartype_id
            ,cpm_start_date,cpm_stop_date
            ,cpm_day_type
            ,cpm_overnight_status,cpm_overnight_start,cpm_overnight_stop
            ,cpm_fine_amount
            ,cpm_time_for_free
            ,create_by,create_date
            ,company_id
            ) values(
            fun_generate_uuid('CPM'||trim(to_char(${company_id},'000')),5)
            ,$1,$2,$3
            ,$4,$5
            ,$6
            ,$7,$8,$9
            ,$10
            ,$11
            ,$12,current_timestamp
            ,$13
            );`;
        const query = {
            text: sql,
            values: [
                cpm_name_th, cpm_name_en, cartype_id
                , start_date, stop_date
                , cpm_day_type
                , cpm_overnight_status, over_night_start, over_night_stop
                , cpm_fine_amount
                , cpm_time_for_free
                , employee_id
                , company_id
            ]
        }
        console.log(query)
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
