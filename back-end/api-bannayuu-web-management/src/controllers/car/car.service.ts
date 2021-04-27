import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CarService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getCarByHomeId(body: any) {
        const company_id = body.company_id;
        const home_id = body.home_id ? body.home_id : '';
        let sql = `select 
        home_car_id,home_id
        ,home_car_code
        ,home_car_license_plate
        ,home_car_name,home_car_brand
        ,home_car_remark
        ,case when delete_flag = 'N' then 'active'
        else 'inactive' end as status
        from m_home_car
        where 
        company_id = $1
        and home_id = $2
         order by home_car_license_plate`;

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

    async getCarByCarId(body: any) {
        const company_id = body.company_id;
        const home_car_id = body.home_car_id ? body.home_car_id : '';
        let sql = `select 
        home_car_id,mhc.home_id,mh.home_address
        ,home_car_code
        ,home_car_license_plate
        ,home_car_name,home_car_brand
        ,home_car_remark
        ,case when mhc.delete_flag = 'N' then 'active'
        else 'inactive' end as status
        ,to_char(mhc.create_date,'YYYY-MM-dd HH24:MI:ss') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mhc.create_by::integer) as create_by
        ,to_char(mhc.update_date,'YYYY-MM-dd HH24:MI:ss') as update_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mhc.update_by::integer) as update_by
        ,mc.company_name
        from m_home_car mhc
        left join m_home mh on mhc.home_id = mh.home_id
        left join m_company mc on mhc.company_id = mc.company_id
        where 
        mhc.company_id = $1
        and home_car_id = $2
       `;

        const query = {
            text: sql
            , values: [company_id, home_car_id]
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
            result: res.result[0],
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async addCarByHomeId(body: any, req: any) {
        const employeeObj = req.user.employee;
        const home_id = body.home_id;
        const company_id = body.company_id;
        const employee_id = employeeObj.employee_id;
        const license_plate = body.license_plate;
        const car_brand = body.car_brand;
        let sql = `insert into m_home_car(
            home_id,home_car_code,home_car_license_plate,home_car_brand
            ,create_by,create_date,company_id
        ) values($1
           ,fun_generate_uuid('CAR'||trim(to_char(${company_id},'000')),6)
           ,$2,$3
           ,$4,current_timestamp,$5 
        );`
        const query = {
            text: sql
            , values: [
                home_id
                ,license_plate,car_brand
                ,employee_id,company_id
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

    async editCarInfo(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const home_car_id = body.home_car_id;
        const license_plate = body.license_plate;
        const remark = body.remark
        const car_status = body.car_status===false ? 'Y' : 'N';
        const car_brand = body.car_brand;
        let sql = `update m_home_car set
        home_car_license_plate = $1
        ,home_car_brand = $2
        ,home_car_remark = $3
        ,update_by = $4,update_date = current_timestamp
        ,delete_flag = $5
        where company_id = $6 and home_car_id = $7;
        `
        const query = {
            text: sql
            , values: [
                license_plate
                ,car_brand
                ,remark
                ,employee_id
                ,car_status
                ,company_id
                ,home_car_id
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


    async editCarHomeChange(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const home_car_id = body.home_car_id;
        const home_id = body.home_id;
        const remark = body.remark;
        let sql = `update m_home_car set
        home_id = $1
        ,home_car_remark = $2
        ,update_by = $3,update_date = current_timestamp
        where company_id = $4 and home_car_id = $5;
        `
        const query = {
            text: sql
            , values: [
                home_id
                ,remark
                ,employee_id
                ,company_id
                ,home_car_id
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
