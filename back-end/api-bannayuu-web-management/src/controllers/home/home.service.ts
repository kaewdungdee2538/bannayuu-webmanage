import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class HomeService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection) { }

    async getAllHome(body: any, employeeInfo: any) {
        return await this.getAll(body, employeeInfo);
    }
    async createHome(body: any, homeInfo: any) {
        return await this.addHome(body, homeInfo);
    }

    async getAll(body: any, employeeInfo: any) {
        const company_id = body.company_id;
        const home_address = body.home_address ? body.home_address : '';
        let sql = `select home_id,home_code,home_name,home_address
        , home_data,home_remark,create_date,update_date,
        case when delete_flag = 'N' then 'active'
        else 'inactive' end as status
        from m_home 
        where company_id = $1`;
        if(home_address)
            sql += ` and home_address LIKE '%${home_address}%'`
        sql += ` order by home_address;`
        const query = {
            text: sql
            , values: [company_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }
    
    async getAllHomeNotDisable(body:any){
        const company_id = body.company_id;
        const home_address = body.home_address ? body.home_address : '';
        let sql = `select home_id,home_code,home_name,home_address
        , home_data,home_remark,create_date,update_date,
        case when delete_flag = 'N' then 'active'
        else 'inactive' end as status
        from m_home 
        where delete_flag = 'N' and company_id = $1`;
        if(home_address)
            sql += ` and home_address LIKE '%${home_address}%'`
        sql += ` order by home_address;`
        const query = {
            text: sql
            , values: [company_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async addHome(body: any, employeeInfo: any) {
        const employeeObj = employeeInfo.employee
        const company_id = body.company_id
        const home_address = body.home_address
        const home_remark = body.home_remark
        const employee_id = employeeObj.employee_id
        let sql = `insert into m_home(home_code,company_id,home_address,home_remark,create_by,create_date)
        values(
            fun_generate_uuid('HOME'||trim(to_char(${company_id},'000')),6)
            ,$1,$2,$3,$4,current_timestamp
            );`
        const query1 = {
            text: sql
            , values: [company_id, home_address, home_remark, employee_id]
        }
        const res = await this.dbconnecttion.savePgData([query1]);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async getHomeInfoByID(body: any, employeeInfo: any) {
        const home_id = body.home_id;
        const company_id = body.company_id
        const employee = employeeInfo.employee
        const employee_id = employee.employee_id
        let sql = `select home_id,home_code,home_name,home_address
        ,home_type,home_data,home_remark
        ,mh.create_date
        ,mh.update_date
        ,mh.company_id
		,mc.company_name
		,(select CONCAT(first_name_th,' ',last_name_th)
		  from m_employee
		  where employee_id = mh.create_by::integer
		 ) as create_by
		 ,(select CONCAT(first_name_th,' ',last_name_th)
		  from m_employee
		  where employee_id = mh.update_by::integer
		 ) as update_by
        ,case when mh.delete_flag = 'N' then 'active'
        else 'inactive' end as status
        from m_home mh
        left join m_company mc on mh.company_id = mc.company_id
        where  mh.company_id=$1 and mh.home_id =$2
        limit 1;`
        const query = {
            text: sql
            , values: [company_id, home_id]
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async editHomeInfo(body: any, employeeInfo: any) {
        const employeeObj = employeeInfo.employee
        const home_address = body.home_address
        const home_remark = body.home_remark
        const employee_id = employeeObj.employee_id
        const company_id = body.company_id
        const home_id = body.home_id
        let query1, query2;
        console.log(body.home_enable)
        if (body.home_enable) {
            let sql = `update m_home set 
            home_address = $1,home_remark=$2
            ,update_by=$3,update_date=now()
            ,delete_flag='N'
            where company_id=$4 and home_id=$5
            ;`
            query1 = {
                text: sql
                , values: [
                    home_address, home_remark
                    , employee_id, company_id, home_id]
            }
            let sql2 = `update m_home_line set 
            update_by=$1,update_date=current_timestamp
            ,delete_flag='N'
            where company_id=$2 and home_id=$3
            ;`
            query2 = {
                text:sql2
                ,values :[
                    employee_id
                    ,company_id,home_id
                ]
            }
        } else {
            let sql = `update m_home set 
        home_address = $1,home_remark=$2
        ,update_by=$3,update_date=current_timestamp
        ,delete_flag = 'Y',delete_date = current_timestamp
        ,delete_by = $6
        where company_id=$4 and home_id=$5
        ;`
            query1 = {
                text: sql
                , values: [
                    home_address, home_remark
                    , employee_id, company_id, home_id
                    , employee_id
                ]
            }
            let sql2 = `update m_home_line set
        update_by=$1,update_date=current_timestamp
        ,delete_flag = 'Y',delete_date = current_timestamp
        ,delete_by = $2
        where company_id=$3 and home_id=$4
        ;`
        query2 = {
            text:sql2
            ,values:[
                employee_id
                ,employee_id
                ,company_id,home_id
            ]
        }
        }
        const querys = [query1, query2]
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

    async deleteHomeByID(body: any, employeeObj: any) {
        const employee = employeeObj.employee;
        const employee_id = employee.employee_id;
        const company_id = body.company_id;
        const home_id = body.home_id;
        let sql = `update m_home 
        set delete_flag = 'Y'
        ,delete_date=current_timestamp,delete_by=$1
        where company_id=$2
        and home_id=$3
        ;`
        const query = {
            text: sql
            , values: [
                employee_id
                , company_id
                , home_id
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
