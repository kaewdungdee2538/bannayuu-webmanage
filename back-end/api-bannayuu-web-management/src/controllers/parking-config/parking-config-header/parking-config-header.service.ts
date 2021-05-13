import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FuncUtils } from 'src/utils/func.utils';

@Injectable()
export class ParkingConfigHeaderService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
        private readonly funcUtils: FuncUtils,
    ) { }

    async getCheckFirstOrSecondHeaderByCPMID(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `select cph_id from m_calculate_parking_header mcph
        where mcph.delete_flag = 'N' 
        and mcph.company_id = $1 and mcph.cpm_id = $2`
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
        else if (res.result.length === 0)
            throw new StatusException(
                {
                    error: null,
                    result: {
                        priority_no:"FIRST"
                    },
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
        else
            throw new StatusException(
                {
                    error: null,
                    result: {
                        priority_no:"SECOND"
                    },
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
    }

    async getParkingConfigHeaderAllByCPMID(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `select cph_id,cph_code,mcph.cpm_id,cph_name_th,cph_name_en
        ,mc.cartype_name_th
        ,to_char(time_zone_start::time,'HH24:MI:SS') as time_zone_start
        ,to_char(time_zone_stop::time,'HH24:MI:SS') as time_zone_stop
        ,case when cph_priority_no = 1 then 'FIRST'
        else 'SECOND' end as priority_no
        from m_calculate_parking_header mcph
        left join m_calculate_parking_master mcpm
        on mcph.cpm_id = mcpm.cpm_id
        left join m_cartype mc
        on mcph.cartype_id = mc.cartype_id
        where mcph.delete_flag = 'N' and mcph.company_id = $1 and mcph.cpm_id = $2
        order by cph_priority_no`
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
                    result: res.result,
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
    }

    async getParkingConfigHeaderByCPHID(body: any) {
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        let sql = `select cph_id,cph_code,mcph.cpm_id,cph_name_th,cph_name_en,mcph.cartype_id
        ,to_char(time_zone_start::time,'HH24:MI:ss') as time_zone_start
        ,to_char(time_zone_stop::time,'HH24:MI:ss') as time_zone_stop
        ,to_char(cph_cal_every_interval::time, 'HH24:MI:ss') as cph_cal_every_interval
        ,cph_cal_amount_value
        ,cph_status
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcph.create_by) as create_by
        ,to_char(mcph.create_date,'YYYY-MM-DD HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcph.update_by) as update_by
        ,to_char(mcph.update_date,'YYYY-MM-DD HH24:MI:ss') as update_date
        ,cpm_name_th,cpm_name_en
        ,mc.cartype_name_th
        ,mcp.company_name
        ,mcph.cph_remark as remark
        ,case when cph_priority_no = 1 then 'FIRST'
        else 'SECOND' end as priority_no
        from m_calculate_parking_header mcph
        left join m_calculate_parking_master mcpm
        on mcph.cpm_id = mcpm.cpm_id
        left join m_cartype mc
        on mcph.cartype_id = mc.cartype_id
        left join m_company mcp 
        on mcph.company_id = mcp.company_id
        where mcph.delete_flag = 'N' and mcph.company_id = $1 and mcph.cph_id = $2
        order by cph_priority_no`
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
                    result: res.result[0],
                    message: this.errMessageUtilsTh.messageSuccess,
                    statusCode: 200,
                },
                200);
    }

    async createParkingHeaderFirstRecordByCartype(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cpm_id = body.cpm_id;
        const cph_ref_id = body.cph_ref_id ? body.cph_ref_id : null;
        const cph_name_th = body.name_th;
        const cph_name_en = body.name_en;
        const cartype_id = body.cartype_id;
        const time_zone_start = "00:00:00";
        const time_zone_stop = "23:59:59"
        const cph_cal_every_interval = body.interval_every ? body.interval_every : "01:00:00";
        const cph_cal_amount_value = body.amount_value_for_cal ? body.amount_value_for_cal : 0;
        const cph_priority_no = 1;
        const objInput = {
            company_id, employee_id, cpm_id, cph_ref_id
            , cph_name_th, cph_name_en, cartype_id
            , time_zone_start, time_zone_stop
            , cph_cal_every_interval, cph_cal_amount_value
            , cph_priority_no
        }
        return await this.createParkingHeader(objInput);
    }

    async createParkingHeaderSecondRecordByCartype(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const cpm_id = body.cpm_id;

        const cph_name_th = body.name_th;
        const cph_name_en = body.name_en;
        const cartype_id = body.cartype_id;
        const time_zone_start = body.start_time_zone;
        const time_zone_stop = body.stop_time_zone;
        const cph_cal_every_interval = body.interval_every ? body.interval_every : "01:00:00";
        const cph_cal_amount_value = body.amount_value_for_cal ? body.amount_value_for_cal : 0;
        const cpmObj = {
            company_id, cartype_id, cpm_id
        }
        const cph_priority_no = await this.funcUtils.getPriorityNoFromCPHWithCartypeAndCPMID(cpmObj);
        const cph_ref_id = await this.funcUtils.getCphIdRefFromCPH(cpmObj);
        const objInput = {
            company_id, employee_id, cpm_id, cph_ref_id
            , cph_name_th, cph_name_en, cartype_id
            , time_zone_start, time_zone_stop
            , cph_cal_every_interval, cph_cal_amount_value
            , cph_priority_no
        }
        return await this.createParkingHeader(objInput);
    }

    async createParkingHeader(objInput: any) {
        const company_id = objInput.company_id;
        const employee_id = objInput.employee_id;
        const cpm_id = objInput.cpm_id;
        const cph_ref_id = objInput.cph_ref_id;
        const cph_name_th = objInput.cph_name_th;
        const cph_name_en = objInput.cph_name_en;
        const cartype_id = objInput.cartype_id;
        const time_zone_start = objInput.time_zone_start;
        const time_zone_stop = objInput.time_zone_stop
        const cph_cal_every_interval = objInput.cph_cal_every_interval;
        const cph_cal_amount_value = objInput.cph_cal_amount_value;
        const cph_priority_no = objInput.cph_priority_no;

        let sql = `insert into m_calculate_parking_header(
            cph_code
            ,cpm_id,cph_ref_id
            ,cph_name_th,cph_name_en
            ,cartype_id
            ,time_zone_start,time_zone_stop
            ,cph_cal_every_interval,cph_cal_amount_value
            ,cph_status
            ,create_date,create_by
            ,company_id
            ,cph_priority_no
        ) values(
            fun_generate_uuid('CPH'||trim(to_char(${company_id},'000')),4)
            ,$1,$2
            ,$3,$4
            ,$5
            ,$6,$7
            ,$8,$9
            ,'Y'
            ,current_timestamp,$10
            ,$11
            ,$12
        );`
        const query = {
            text: sql,
            values: [
                cpm_id, cph_ref_id
                , cph_name_th, cph_name_en
                , cartype_id
                , time_zone_start, time_zone_stop
                , cph_cal_every_interval, cph_cal_amount_value
                , employee_id
                , company_id
                , cph_priority_no
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


    async disableParkingHeaderFirst(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const remark = body.remark;
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        let sql = `update m_calculate_parking_header set
        delete_flag = 'Y',delete_date = current_timestamp,delete_by = $1
        ,cph_remark = $2
        where company_id = $3 and cpm_id = $4
        ;`
        const query = {
            text: sql,
            values: [
                employee_id
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

    async disableParkingHeaderWithId(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const remark = body.remark;
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        let sql1 = `update m_calculate_parking_header set
        delete_flag = 'Y',delete_date = current_timestamp,delete_by = $1
        ,cph_remark = $2
        where company_id = $3 and cph_id = $4
        ;`
        const query1 = {
            text: sql1,
            values: [
                employee_id
                , remark
                , company_id, cph_id
            ]
        }
        let sql2 =  `update m_calculate_parking_sub set
        delete_flag = 'Y'
        ,cps_remark = $1
        ,delete_by = $2,delete_date = current_timestamp
        where company_id = $3 and cph_id = $4
        ;`
        const query2 = {
            text: sql2,
            values: [
                remark
                ,employee_id
                ,company_id,cph_id
            ]
        }

        const querys = [query1,query2]
        
        const res = await this.dbconnecttion.savePgData(querys);
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


    async editParkingHeaderFirstRecordByCartype(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        // const cartype_id = body.cartype_id;
        const chp_name_th = body.name_th;
        const cph_name_end = body.name_en;
        const cph_cal_every_interval = body.interval_every;
        const cph_cal_amount_value = body.amount_value_for_cal;
        const cph_remark = body.remark;
        let sql = `update m_calculate_parking_header set
        cph_name_th = $1,cph_name_en = $2
        ,cph_cal_every_interval = $3,cph_cal_amount_value = $4
        ,cph_remark = $5,update_by = $6,update_date = current_timestamp
        where company_id = $7 and cph_id = $8
        ;`;
        const query = {
            text: sql,
            values: [
                chp_name_th, cph_name_end
                , cph_cal_every_interval, cph_cal_amount_value
                , cph_remark, employee_id
                , company_id, cph_id
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

    async editParkingHeaderSecondRecordByCartype(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cph_id = body.cph_id;
        // const cartype_id = body.cartype_id;
        const time_zone_start = body.start_time_zone
        const time_zone_stop = body.stop_time_zone
        const chp_name_th = body.name_th;
        const cph_name_end = body.name_en;
        const cph_cal_every_interval = body.interval_every;
        const cph_cal_amount_value = body.amount_value_for_cal;
        const cph_remark = body.remark;
        let sql = `update m_calculate_parking_header set
        cph_name_th = $1,cph_name_en = $2
        ,time_zone_start = $3,time_zone_stop = $4
        ,cph_cal_every_interval = $5,cph_cal_amount_value = $6
        ,cph_remark = $7,update_by = $8,update_date = current_timestamp
        where company_id = $9 and cph_id = $10
        ;`;
        const query = {
            text: sql,
            values: [
                chp_name_th, cph_name_end
                , time_zone_start, time_zone_stop
                , cph_cal_every_interval, cph_cal_amount_value
                , cph_remark, employee_id
                , company_id, cph_id
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
