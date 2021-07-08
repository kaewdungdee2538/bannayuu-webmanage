import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class CompanyService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getCompanyList(body: any) {
        const companyList = body.company_list ? body.company_list : null;
        console.log(companyList)
        let listText = '0';
        if (companyList) {
            console.log(companyList.length)
            for (let num = 0; num < companyList.length; num++) {
                console.log(num)
                if (num === 0)
                    listText = companyList[num];
                else
                    listText = `${listText},${companyList[num]}`
            }
        }
        let sql = `select company_id,concat(company_id,' ',company_name) as company_name
        from m_company
        where company_id in (${listText})
        and delete_flag = 'N'
        order by company_id,company_name
        `;

        const query = {
            text: sql
            , values: []
        }
        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
            statusCode: 200
        }, 200);
        else if(res.result.length === 0) throw new StatusException({
            error: this.errMessageUtilsTh.errCompanyNotInBase,
            result: null,
            message: this.errMessageUtilsTh.errCompanyNotInBase,
            statusCode: 200
        }, 200);
        else throw new StatusException({
            error: null,
            result: res.result,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }
}
