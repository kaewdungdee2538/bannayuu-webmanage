import { Injectable } from '@nestjs/common';
import { dbConnection } from "src/pg_database/pg.database";
import { StatusException } from './callback.status';
import { ErrMessageUtilsTH } from "./err_message_th.utils";
import { FormatDataUtils } from "./format_data.utils";

@Injectable()
export class FuncUtils {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async getPriorityNoFromCPHWithCartypeAndCPMID(CpmObj: any) {
        const company_id = CpmObj.company_id;
        const cartype_id = CpmObj.cartype_id;
        const cpm_id = CpmObj.cpm_id;
        let sql = `select max(cph_priority_no)+1 as cph_priority_no from m_calculate_parking_header
            where delete_flag = 'N' 
            and company_id = $1 and cartype_id = $2 and cpm_id = $3 
           ;`
        const query = {
            text: sql
            , values: [
                company_id, cartype_id, cpm_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else return res.result[0].cph_priority_no;
    }

    async getCphIdRefFromCPH(CpmObj: any) {
        const company_id = CpmObj.company_id;
        const cartype_id = CpmObj.cartype_id;
        const cpm_id = CpmObj.cpm_id;
        let sql = `select cph_id  from m_calculate_parking_header
            where delete_flag = 'N' and cph_priority_no = 1
            and company_id = $1 and cartype_id = $2 and cpm_id = $3 
           ;`
        const query = {
            text: sql
            , values: [
                company_id, cartype_id, cpm_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else return res.result[0].cph_id;
    }

    async getLineNoFromCPSWithCPHID(CpmObj: any) {
        const company_id = CpmObj.company_id;
        const cph_id = CpmObj.cph_id;
        let sql = `select max(line_no)+1 as line_no from m_calculate_parking_sub
            where delete_flag = 'N' 
            and company_id = $1  and cph_id = $2;`
        const query = {
            text: sql
            , values: [
                company_id, cph_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else if (res.result[0].line_no)
            return res.result[0].line_no;
        else return 1;
    }
}