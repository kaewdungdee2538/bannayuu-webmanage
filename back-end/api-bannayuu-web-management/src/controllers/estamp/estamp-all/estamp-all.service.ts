import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class EstampAllService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getVisitorAll(body: any) {
        const license_plate = body.license_plate
        const company_id = body.company_id
        const home_id = body.home_id
        const start_date = body.start_date
        const end_date = body.end_date
        const f_name = body.f_name;
        const l_name = body.l_name;
        let sql = `select 
        visitor_record_id
        ,visitor_record_code
        ,cartype_category_info->'cartype_category_name_th' as cartype_category_name_th
        ,case when tvr.tbv_code IS NULL then visitor_info->>'first_name_th'::TEXT
        else tbv_contact_person
        end as first_name_th
		,case when tvr.tbv_code IS NULL then visitor_info->>'last_name_th'::TEXT 
        else ''
        end as last_name_th
		,tvr.home_id
		,home_info->'home_address' as home_address
		,license_plate
		,to_char(parking_in_datetime,'DD/MM/YYYY HH24:MI:SS') as parking_in_datetime
		,estamp_flag 
        from t_visitor_record tvr left join m_company mc
        on tvr.company_id = mc.company_id
        left join t_booking_visitor tbv 
        on tvr.tbv_code = tbv.tbv_code
        where action_out_flag = 'N' and tvr.company_id =$1
        and parking_in_datetime between $2::timestamp and $3::timestamp
        `
        if (license_plate)
            sql += ` and license_plate like '%${license_plate}%'`
        if (home_id)
            sql += ` and home_id = ${home_id}`
        if (f_name && l_name)
            sql += ` and ((visitor_info->'first_name_th')::text like '%${f_name}%' or (visitor_info->'last_name_th')::text like '%${l_name}%')`
        else if (f_name)
            sql += ` and (visitor_info->'first_name_th')::text like '%${f_name}%'`
        else if (l_name)
            sql += ` and (visitor_info->'last_name_th')::text like '%${l_name}%'`
        sql += ` order by parking_in_datetime,license_plate;`
        const query = {
            text: sql
            , values: [
                company_id, start_date, end_date
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


    async getVisitorInfoByID(body: any) {
        const company_id = body.company_id
        const visitor_record_id = body.visitor_record_id
        let sql = `select 
        visitor_record_id
        ,visitor_record_code,tvr.tbv_code
        ,visitor_slot_number,card_name
        ,cartype_name_th,cartype_name_en
        ,cartype_category_info->'cartype_category_name_th' as cartype_category_name_th
        ,case when tvr.tbv_code IS NULL then visitor_info->>'first_name_th'::TEXT
        else tbv.tbv_contact_person
        end as first_name_th
		,case when tvr.tbv_code IS NULL then visitor_info->>'last_name_th'::TEXT
        else ''
        end as last_name_th
		,action_info->'idividule_type' as idividule_type
		,action_info->'person_contract' as person_contract
		,case when tvr.tbv_code IS NULL then action_info->>'tel_number' ::TEXT
        else tbv.tbv_mobile_contact_person 
        end as tel_number
		,tvr.home_id
		,home_info->'home_address' as home_address
		,license_plate
		,to_char(parking_in_datetime,'DD/MM/YYYY HH24:MI:SS') as parking_in_datetime
		,tvr.estamp_id
        ,estamp_info
        ,to_char(estamp_datetime,'DD/MM/YYYY HH24:MI:SS') as estamp_datetime
        ,estamp_home_line_id
		,estamp_flag 
        ,case when tvr.tbv_code is not null then 'booking' else 'walk in' end as record_from
		,company_name
        ,case when tvr.tbv_code IS NOT NULL then 
        CONCAT(home_line_first_name,' ',home_line_last_name)
        else (select CONCAT(first_name_th,' ',last_name_th) from m_employee where employee_id = tvr.estamp_emp_id)
        end as estamp_form
        from t_visitor_record tvr left join m_company mc
        on tvr.company_id = mc.company_id
        left join t_booking_visitor tbv 
        on tvr.tbv_code = tbv.tbv_code
        left join m_home_line mhl 
        on tvr.estamp_home_line_id = mhl.home_line_id
        where  tvr.company_id =$1
        and visitor_record_id =$2
        limit 1
        `
        const query = {
            text: sql
            , values: [
                company_id,
                visitor_record_id
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
        else if (res.result.length === 0)
            throw new StatusException(
                {
                    error: this.errMessageUtilsTh.errVisitorInfoNotFound,
                    result: null,
                    message: this.errMessageUtilsTh.errVisitorInfoNotFound,
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

    async editEstampByID(body: any, req: any) {
        const employeeObj = req.user.employee;
        const visitor_record_id = body.visitor_record_id;
        const visitor_record_code = body.visitor_record_code;
        const company_id = body.company_id;
        const employee_id = employeeObj.employee_id;
        const estamp_flag = body.estamp_flag;
        const estampInfo = await this.getEstampInfo(body);
        if (!await estampInfo) throw new StatusException({
            error: this.errMessageUtilsTh.errEstampNotInBase,
            result: null,
            message: this.errMessageUtilsTh.errEstampNotInBase,
            statusCode: 200
        }, 200);
        else {
            let query;
            if (estamp_flag === 'Y') {
                let sql = `update t_visitor_record set
                estamp_id = $1,estamp_info= $2
                ,estamp_datetime = current_timestamp
                ,estamp_emp_id = $3
                ,estamp_flag = 'Y'
                where visitor_record_id = $4
                and company_id = $5
                ;`
                query = {
                    text: sql
                    , values: [
                        estampInfo.estamp_id, estampInfo
                        , employee_id
                        , visitor_record_id
                        , company_id
                    ]
                }
            } else {
                let sql = `update t_visitor_record set
                estamp_id = null,estamp_info= null
                ,estamp_datetime = current_timestamp
                ,estamp_emp_id = null
                ,estamp_flag = 'N'
                where visitor_record_id = $1
                and company_id = $2
                ;`
                query = {
                    text: sql
                    , values: [
                        visitor_record_id
                        , company_id
                    ]
                }
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

    async getEstampInfo(body: any) {
        let sql = `select estamp_id,estamp_code,estamp_name_th,estamp_name_en,estamp_remark
        from m_estamp
        where delete_flag = 'N';`
        const query = {
            text: sql
            , values: []
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (await res.error)
            return null;
        else if (res.result.length === 0)
            return null;
        else
            return res.result[0];
    }

    async getVisitorEstampHistoryAll(body: any) {
        const license_plate = body.license_plate
        const company_id = body.company_id
        const home_id = body.home_id
        const start_date = body.start_date
        const end_date = body.end_date
        const f_name = body.f_name;
        const l_name = body.l_name;
        const home_address = body.home_address;
        let sql = `select 
        visitor_record_id
        ,visitor_record_code
        ,case when tvr.tbv_code IS NULL then visitor_info->>'first_name_th'::TEXT
        else tbv.tbv_contact_person
        end as first_name_th
		,case when tvr.tbv_code IS NULL then visitor_info->>'last_name_th'::TEXT 
        else ''
        end as last_name_th
		,action_info->'idividule_type' as idividule_type
		,action_info->'person_contract' as person_contract
		,action_info->'tel_number' as tel_number
		,mh.home_id
		,mh.home_address
		,license_plate
		,to_char(parking_in_datetime,'DD/MM/YYYY HH24:MI:SS') as parking_in_datetime
        ,to_char(estamp_datetime,'DD/MM/YYYY HH24:MI:SS') as estamp_datetime
        from t_visitor_record tvr left join m_company mc
        on tvr.company_id = mc.company_id
        left join m_home mh on tvr.home_id = mh.home_id
        left join t_booking_visitor tbv 
        on tvr.tbv_code = tbv.tbv_code
        where  estamp_flag = 'Y' and tvr.company_id =$1
        and estamp_datetime between $2::timestamp and $3::timestamp
        `
        if (license_plate)
            sql += ` and license_plate like '%${license_plate}%'`
        if (home_address)
            sql += ` and home_address like '%${home_address}%'`
        if (f_name && l_name)
            sql += ` and ((visitor_info->'first_name_th')::text like '%${f_name}%' or (visitor_info->'last_name_th')::text like '%${l_name}%')`
        else if (f_name)
            sql += ` and (visitor_info->'first_name_th')::text like '%${f_name}%'`
        else if (l_name)
            sql += ` and (visitor_info->'last_name_th')::text like '%${l_name}%'`

        sql += ` order by estamp_datetime,license_plate;`
        const query = {
            text: sql
            , values: [
                company_id, start_date, end_date
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
}
