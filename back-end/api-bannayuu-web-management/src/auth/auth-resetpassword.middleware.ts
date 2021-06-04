import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class AuthResetMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {

        const messageLogin = await this.checkLogin(req.body)
        if (messageLogin) {
            console.log('Middleware check reset password value  : ' + messageLogin)
            res.send({
                response: {
                    error: messageLogin
                    , result: null
                    , message: messageLogin
                    , statusCode: 200
                }
            });
        } else
            next();
    }

    async checkLogin(body: any) {
        if (!body.username)
            return this.errMessageUrilTh.errUsernameNotFound
        else if (this.formatDataUtils.isNotCharacterEng(body.username))
            return this.errMessageUrilTh.errUsernameProhibitSpecial
        else if (!body.old_password)
            return this.errMessageUrilTh.errPasswordOldNotFound
        else if (this.formatDataUtils.isNotCharacterEng(body.old_password))
            return this.errMessageUrilTh.errPasswordOldProhibitSpecial
        else if (!body.new_password)
            return this.errMessageUrilTh.errPasswordNewNotFound
        else if (this.formatDataUtils.isNotCharacterEng(body.new_password))
            return this.errMessageUrilTh.errPasswordNewProhibitSpecial
        else if (!body.employee_id)
            return this.errMessageUrilTh.errEmployeeIDNotFound
        else if (this.formatDataUtils.HaveSpecialFormat(body.employee_id))
            return this.errMessageUrilTh.errEmployeeIDProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.employee_id))
            return this.errMessageUrilTh.errEmployeeIDNotNumber;
        return await this.checkEmployeeIdInBase(body);
    }

    async checkEmployeeIdInBase(body: any) {
        const username = body.username;
        const password = body.old_password;
        const company_id = body.company_id;
        console.log(password)
        let sql = `select employee_id, employee_code,first_name_th,last_name_th,username,(passcode = crypt($2, passcode)) as password_status 
        ,me.company_id,mc.company_name,me.company_list,mep.login_maintenance_data as privilege_info
        ,me.employee_status
         FROM m_employee me 
         inner join m_employee_privilege mep on me.employee_privilege_id = mep.employee_privilege_id
         left join m_company mc on me.company_id = mc.company_id
         WHERE me.username = $1 and me.delete_flag = 'N' and mep.delete_flag ='N' and mep.login_maintenance_status='Y'
         and me.company_id = $3
        ;`
        const query = {
            text: sql
            , values: [
                username
                , password
                , company_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        console.log(res)
        if (res.error)
            return res.error
        else if (res.result.length === 0)
            return this.errMessageUrilTh.errEmployeeNotInBase;
        else if (!res.result[0].password_status)
            return this.errMessageUrilTh.errUsernameOrPasswordNotValid;
        else return null;
    }
};

