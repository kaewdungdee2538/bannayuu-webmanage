import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CardService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getCardAll(body: any) {
        const company_id = body.company_id;
        const card_code = body.card_code;
        const card_name = body.card_name;

        let sql = `select card_id,card_code,card_name
        ,case when status_flag = 'Y' then 'USE'
        when cardproblem_flag = 'Y' then 'PROBLEM'
        else 'NOT' end as status
        from m_card mcd
        where delete_flag = 'N' and cardproblem_flag = 'N'
        and company_id = $1
        `;
        if (card_code && card_name)
            sql += ` and (card_code = '${card_code}' or card_name LIKE '%${card_name}%')`
        else if (card_code)
            sql += ` and card_code = '${card_code}'`
        else if (card_name)
            sql += ` and card_name LIKE '%${card_name}%'`
        sql += ` order by card_name`

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

    async getCardInfoByCardIDOrName(body: any) {
        const company_id = body.company_id;
        const card_id = body.card_id;
        let sql = `select card_id,card_code,card_name
        ,case when mcd.status_flag = 'Y' then 'USE'
        when cardproblem_flag = 'Y' then 'PROBLEM'
        else 'NOT' end as status
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcd.create_by) as create_by
        ,(select concat(first_name_th,' ',last_name_th) from m_employee where employee_id = mcd.update_by) as update_by
        ,to_char(mcd.create_date,'YYYY-MM-DD HH24:MI:SS') as create_date
        ,to_char(mcd.update_date,'YYYY-MM-DD HH24:MI:SS') as update_date
        ,card_remark as remark
        ,company_name
        from m_card mcd
        left join m_company mc
        on mcd.company_id = mc.company_id
        where mcd.delete_flag = 'N'
        and mcd.company_id = $1
        and mcd.card_id = $2
        order by card_name
        `;

        const query = {
            text: sql
            , values: [company_id, card_id]
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

    async createCard(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const card_code = body.card_code;
        const card_name = body.card_name;

        let sql = `insert into m_card(
            card_code,card_name
            ,create_by,create_date
            ,company_id
        ) values(
            $1,$2
            ,$3,current_timestamp
            ,$4
        );
        `;
        const query = {
            text: sql,
            values: [
                card_code, card_name
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

    async editCard(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const card_name = body.card_name;
        const card_id = body.card_id;
        const remark = body.remark;
        let sql = `update m_card set
        card_name = $1,update_by = $2,update_date = current_timestamp
        ,card_remark = $3
        where company_id = $4 and card_id = $5
        ;`;
        const query = {
            text: sql,
            values: [
                card_name
                , employee_id
                , remark
                , company_id
                , card_id
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

    async disableCard(body: any, req: any) {
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id;
        const company_id = body.company_id;
        const card_id = body.card_id;
        const remark = body.remark;
        let sql = `update m_card set
        delete_flag = 'Y',delete_by = $1,delete_date = current_timestamp
        ,card_remark = $2
        where company_id = $3 and card_id = $4
        ;`;
        const query = {
            text: sql,
            values: [
                employee_id
                , remark
                , company_id
                , card_id
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
