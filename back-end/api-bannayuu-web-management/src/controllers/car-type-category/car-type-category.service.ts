import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CarTypeCategoryService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getCartypeCategoryAll(body: any) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;

        let sql = `select cartype_category_id,cartype_category_code
        ,cartype_category_name_contraction,cartype_category_name_th,cartype_category_name_en
        ,cartype_name_th,cartype_name_en
        from m_cartype_category mcc
        left join m_cartype mc
        on mcc.cartype_id = mc.cartype_id
        where mcc.delete_flag = 'N'
        and mcc.company_id = $1
        and mcc.cartype_id = $2 
        order by cartype_category_id
        `;
        const query = {
            text: sql
            , values: [company_id, cartype_id]
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

    async getCartypeCategoryById(body: any) {
        const company_id = body.company_id;
        const cartype_category_id = body.cartype_category_id;

        let sql = `select cartype_category_id,cartype_category_code
        ,cartype_category_name_contraction,cartype_category_name_th,cartype_category_name_en
        ,cartype_name_th,cartype_name_en
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcc.create_by::integer) as create_by
        ,to_char(mcc.create_date,'YYYY-MM-DD HH24:MI:SS') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcc.update_by::integer) as update_by
        ,to_char(mcc.update_date,'YYYY-MM-DD HH24:MI:SS') as update_date
        ,company_name
        from m_cartype_category mcc
        left join m_cartype mc
        on mcc.cartype_id = mc.cartype_id
        left join m_company mcom
        on mcc.company_id = mcom.company_id
        where mcc.delete_flag = 'N'
        and mcc.company_id = $1
        and mcc.cartype_category_id = $2
        `;
        const query = {
            text: sql
            , values: [company_id, cartype_category_id]
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

    async createCartypeCategory(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        const name_th = body.name_th;
        const name_en = body.name_en;
        const name_contraction = body.name_contraction.toUpperCase();
        let sql = `insert into m_cartype_category(
            cartype_category_code
            ,cartype_category_name_th,cartype_category_name_en
            ,cartype_category_name_contraction
            ,cartype_id
            ,create_by,create_date
            ,company_id
        ) values(
            fun_generate_uuid('CT'||trim(to_char(${company_id},'000'))||trim(to_char(${cartype_id},'00')),4)
            ,$1,$2
            ,$3,$4
            ,$5,current_timestamp
            ,$6
        )
        `;
        const query = {
            text: sql,
            values: [
                name_th, name_en
                , name_contraction, employee_id
                , employee_id, company_id
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

    async editCartypeCategory(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_category_id = body.cartype_category_id;
        const name_th = body.name_th;
        const name_en = body.name_en;
        const name_contraction = body.name_contraction.toUpperCase();
        const remark = body.remark;
        let sql = `update m_cartype_category set
        cartype_category_name_th = $1,cartype_category_name_en = $2
        ,cartype_category_name_contraction = $3
        ,update_by = $4,update_date = current_timestamp
        ,cartype_category_remark = $5
        where company_id = $6
        and cartype_category_id = $7
        `;
        const query = {
            text: sql,
            values: [
                name_th, name_en
                , name_contraction
                , employee_id
                , remark
                , company_id
                , cartype_category_id
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

    async disableCartypeCategory(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_category_id = body.cartype_category_id;
        const remark = body.remark;
        let sql = `update m_cartype_category set
        delete_flag = 'Y'
        ,delete_by = $1,delete_date = current_timestamp
        ,cartype_category_remark = $2
        where company_id = $3
        and cartype_category_id = $4
        `;
        const query = {
            text: sql,
            values: [
                employee_id
                , remark
                , company_id
                , cartype_category_id
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
