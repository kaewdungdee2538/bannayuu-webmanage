import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CarTypeService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }
    async getCarTypeByCompant_id(body: any) {
        const company_id = body.company_id;
        let sql = `select cartype_id,cartype_code
        ,cartype_name_th,cartype_name_en,cartype_name_contraction
        from m_cartype
        where delete_flag = 'N'
        and company_id = $1
        order by cartype_id
        `;

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

    async getCartypeByCartypeId(body: any) {
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        let sql = `select cartype_id,cartype_code
        ,cartype_name_th,cartype_name_en,cartype_name_contraction
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mc.create_by::integer) as create_by
        ,to_char(mc.create_date,'YYYY-MM-DD HH24:MI:SS') as create_date
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mc.update_by::integer) as update_by
        ,to_char(mc.update_date,'YYYY-MM-DD HH24:MI:SS') as update_date
        ,cartype_remark as remark
        ,company_name
        from m_cartype mc
        left join m_company mcom
        on mc.company_id = mcom.company_id
        where mc.delete_flag = 'N'
        and mc.company_id = $1
        and mc.cartype_id = $2
        ;`
        const query = {
            text: sql,
            values: [company_id, cartype_id]
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

    async createCartype(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_name_th = body.name_th;
        const cartype_name_en = body.name_en;
        const cartype_name_contraction = body.name_contraction.toUpperCase();
        let sql = `insert into m_cartype(
            cartype_code
            ,cartype_name_th,cartype_name_en
            ,cartype_name_contraction
            ,create_by,create_date
            ,company_id
        ) values(
            fun_generate_uuid('CT'||trim(to_char(${company_id},'000')),4)
            ,$1,$2
            ,$3
            ,$4,current_timestamp
            ,$5
        );
        `;
        const query = {
            text: sql,
            values: [
                cartype_name_th, cartype_name_en
                , cartype_name_contraction
                , employee_id
                , company_id
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

    async editCartype(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        const cartype_name_th = body.name_th;
        const cartype_name_en = body.name_en;
        const cartype_name_contraction = body.name_contraction.toUpperCase();
        const cartype_remark = body.remark;
        let sql = `update m_cartype set
        cartype_name_th = $1,cartype_name_en = $2
        ,cartype_name_contraction = $3
        ,update_by = $4,update_date = current_timestamp
        ,cartype_remark = $5
        where delete_flag = 'N'
        and company_id = $6
        and cartype_id = $7
        `;
        const query = {
            text: sql,
            values: [
                cartype_name_th, cartype_name_en
                , cartype_name_contraction
                , employee_id
                , cartype_remark
                , company_id
                , cartype_id
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

    async disableCartype(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const cartype_id = body.cartype_id;
        const cartype_remark = body.remark;
        let sql = `update m_cartype set
        delete_flag = 'Y'
        ,delete_by = $1,delete_date = current_timestamp
        ,cartype_remark = $2
        where delete_flag = 'N'
        and company_id = $3
        and cartype_id = $4
        `;
        const query = {
            text: sql,
            values: [
                employee_id
                , cartype_remark
                , company_id
                , cartype_id
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
