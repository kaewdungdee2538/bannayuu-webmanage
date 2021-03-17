import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class EstampChangeHomeService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    
    async getVisitorNotEstamp(body:any){
        const license_plate = body.license_plate
        const company_id = body.company_id
        const home_address = body.home_address
        const start_date = body.start_date
        const end_date = body.end_date
        const f_name = body.f_name;
        const l_name = body.l_name;

        let sql = `select 
        visitor_record_id
        ,visitor_record_code,tbv_code
        ,visitor_slot_number,card_name
        ,cartype_name_th,cartype_name_en
        ,cartype_category_info->'cartype_category_name_th' as cartype_category_name_th
        ,visitor_info->'first_name_th' as first_name_th
		,visitor_info->'last_name_th' as last_name_th
		,action_info->'idividule_type' as idividule_type
		,action_info->'person_contract' as person_contract
		,action_info->'tel_number' as tel_number
		,mh.home_id
		,home_info->'home_address' as home_address
		,license_plate
		,to_char(parking_in_datetime,'DD/MM/YYYY HH24:MI:SS') as parking_in_datetime
		,estamp_id,estamp_info,estamp_datetime,estamp_home_line_id
		,estamp_flag 
        ,case when tbv_code = null then 'booking' else 'walk in' end as record_from
		,company_name
        ,mh.home_address as estamp_form
        from t_visitor_record tvr left join m_company mc
        on tvr.company_id = mc.company_id
        left join m_home mh on tvr.home_id = mh.home_id
        where action_out_flag = 'N' and estamp_flag = 'N' and tvr.company_id =$1
        and parking_in_datetime between $2::timestamp and $3::timestamp
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

    async changeHomeForVisitor(body:any){
        const company_id = body.company_id;
        const home_id = body.home_id;
        const visitor_record_id = body.visitor_record_id;
        const HomeInfo = await this.getHomeInfo(body);
        const home_info = {
            home_id: HomeInfo.home_id
            , home_code: HomeInfo.home_code
            , home_name: HomeInfo.home_name
            , home_address: HomeInfo.home_address
            , home_type : HomeInfo.home_type
            , home_data: HomeInfo.home_data
            , home_remark: HomeInfo.home_remark
            , home_privilege_line_amount: HomeInfo.home_privilege_line_amount
            , home_privilege_card_amount: HomeInfo.home_privilege_card_amount
        };
        let sql = `update t_visitor_record set 
        home_id = $1,home_info = $2 where visitor_record_id =$3
        and company_id = $4
        ;`
        const query = {
            text:sql
            ,values:[home_id,home_info,visitor_record_id,company_id]
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

    async getHomeInfo(body:any){
        const company_id = body.company_id;
        const home_id = body.home_id;
        let sql = `select * from m_home where
        company_id = $1 and home_id = $2 limit 1;`
        const query = {
            text:sql
            ,values:[company_id,home_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        return res.result[0];
    }
}
