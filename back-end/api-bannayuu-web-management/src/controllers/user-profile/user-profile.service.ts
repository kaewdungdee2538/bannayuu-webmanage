import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class UserProfileService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getUserProfileByID(body: any, req: any) {
        const company_id = body.company_id;
        const employeeObj = req.user.employee;
        const employee_id = employeeObj.employee_id
        let sql = `select 
        employee_id,employee_code
        ,prefix_name_th,first_name_th,last_name_th,nick_name_th
        ,prefix_name_en,first_name_en,last_name_en,nick_name_en
        ,address,employee_mobile,employee_line,employee_email
        ,employee_picture_path,username
        ,company_name
        from m_employee me
        left join m_company mc on me.company_id = mc.company_id
        where me.delete_flag = 'N'
        and me.company_id = $1
        and employee_id = $2 
        `

        const query = {
            text: sql
            , values: [company_id, employee_id]
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
}
