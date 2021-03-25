import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class ParcelService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }


    async addParcelReceive(body: any, req: any, pathCustomer: any) {
        const employeeObj = req.user.employee;
        const image_parcel_receive = pathCustomer[0];
        const company_id = body.company_id;
        const tpi_title = body.tpi_title;
        const tpi_detail = body.tpi_detail;
        const receive_parcel_detail = body.receive_parcel_detail;
        const home_address = body.home_address;
        const employee_id = employeeObj.employee_id;
        const receive_parcel_data = {
            image_parcel_receive
        }

        let sql = `insert into t_parcel_info (
            tpi_code,tpi_datetime
            ,tpi_title,tpi_detail
            ,receive_parcel_datetime,receive_parcel_by
            ,receive_parcel_detail,receive_parcel_data
            ,home_id
            ,company_id
            ,tpi_status   
            ,create_by,create_date     
        ) values(
            fun_generate_uuid('TPI'||trim(to_char(${company_id},'000')),5),current_timestamp
            ,$1,$2
            ,current_timestamp,$3
            ,$4,$5
            ,(select home_id from m_home where home_address = $6 and company_id = $7)
            ,$7
            ,'receive_parcel'
            ,$8,current_timestamp
        );`

        const query = {
            text: sql
            , values: [
                tpi_title, tpi_detail
                , employee_id
                , receive_parcel_detail, receive_parcel_data
                , home_address
                , company_id
                , employee_id
            ]
        }
        const res = await this.dbconnecttion.savePgData([query]);
        if (res.error) {
            console.log(res.error)
            throw new StatusException({
                error: res.error,
                result: null,
                message: this.errMessageUtilsTh.messageProcessFail,
                statusCode: 200
            }, 200);
        } else throw new StatusException({
            error: null,
            result: this.errMessageUtilsTh.messageSucceessEn,
            message: this.errMessageUtilsTh.messageSuccess,
            statusCode: 200
        }, 200);
    }

    async addParcelReject(body: any, req: any, pathCustomer: any) {
        const employeeObj = req.user.employee;
        const image_parcel_send = pathCustomer[0];
        const company_id = body.company_id;
        const send_parcel_detail = body.send_parcel_detail;
        const employee_id = employeeObj.employee_id;
        const tpi_id = body.tpi_id;
        const receive_parcel_data = {
            image_parcel_send
        }

        let sql = `update t_parcel_info set
        send_parcel_detail = $1,send_parcel_data =$2
        ,send_parcel_datetime = current_timestamp
        ,send_parcel_by = $3
        ,update_by = $3,update_date = current_timestamp
        ,tpi_status = 'reject_parcel'
        where company_id = $4 and tpi_id = $5
        ;`

        const query = {
            text: sql
            , values: [
                send_parcel_detail, receive_parcel_data
                , employee_id
                , company_id
                , tpi_id
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

    async addParcelSend(body: any, req: any, pathCustomer: any) {
        const employeeObj = req.user.employee;
        const image_parcel_send = pathCustomer[0];
        const company_id = body.company_id;
        const send_parcel_detail = body.send_parcel_detail;
        const employee_id = employeeObj.employee_id;
        const tpi_id = body.tpi_id;
        const receive_parcel_data = {
            image_parcel_send
        }

        let sql = `update t_parcel_info set
        send_parcel_detail = $1,send_parcel_data =$2
        ,send_parcel_datetime = current_timestamp
        ,send_parcel_by = $3
        ,update_by = $3,update_date = current_timestamp
        ,tpi_status = 'send_parcel'
        where company_id = $4 and tpi_id = $5
        ;`

        const query = {
            text: sql
            , values: [
                send_parcel_detail, receive_parcel_data
                , employee_id
                , company_id
                , tpi_id
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

    async getParcelWaitToSend(body: any) {
        const company_id = body.company_id;
        const home_address = !body.home_address ? null : body.home_address;
        const start_date = !body.start_date ? '' : body.start_date;
        const end_date = !body.end_date ? '' : body.end_date;
        let sql = `select tpi_id,ref_tpi_id,tpi.home_id,mh.home_address,tpi_code
        ,to_char(tpi_datetime,'DD/MM/YYYY HH24:MI:SS') as tpi_datetime,tpi_title,tpi_detail
        ,to_char(receive_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_parcel_datetime
        ,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.receive_parcel_by::integer) as receive_parcel_by
        ,receive_parcel_detail,receive_parcel_data->'image_parcel_receive' as image_parcel_receive
        ,tpi_status,tpi_flag
        ,tpi_remark
        from t_parcel_info tpi 
        left join m_company mc on tpi.company_id = mc.company_id
        left join m_home mh on tpi.home_id = mh.home_id
        where tpi.delete_flag = 'N' and tpi_status = 'receive_parcel'
        and tpi.company_id = $1
        and receive_parcel_datetime between $2 and $3 
        `
        if (home_address) {
            sql += ` and mh.home_address = '${home_address}'`
        }

        sql += ' order by mh.home_address,receive_parcel_datetime;'
        const query = {
            text: sql
            , values: [company_id, start_date, end_date]
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

    async getParcelSended(body: any) {
        const company_id = body.company_id;
        const home_address = !body.home_address ? null : body.home_address;
        const start_date = !body.start_date ? '' : body.start_date;
        const end_date = !body.end_date ? '' : body.end_date;
        let sql = `select tpi_id,ref_tpi_id,tpi.home_id,mh.home_address,tpi_code
        ,to_char(tpi_datetime,'DD/MM/YYYY HH24:MI:SS') as tpi_datetime,tpi_title,tpi_detail
        ,to_char(send_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as send_parcel_datetime
		,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.send_parcel_by::integer) as send_parcel_by
        ,send_parcel_detail,send_parcel_data->'image_parcel_send' as image_parcel_send
        ,tpi_status,tpi_flag
        ,tpi_remark
        from t_parcel_info tpi 
        left join m_company mc on tpi.company_id = mc.company_id
        left join m_home mh on tpi.home_id = mh.home_id
        where tpi.delete_flag = 'N' and tpi_status in ('send_parcel')
        and tpi.company_id = $1
        and send_parcel_datetime between $2 and $3 
        `
        if (home_address) {
            sql += ` and mh.home_address = '${home_address}'`
        }

        sql += ' order by mh.home_address,receive_parcel_datetime;'
        const query = {
            text: sql
            , values: [company_id, start_date, end_date]
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

    
    async getParcelWaitToSendByID(body: any) {
        const company_id = body.company_id;
        const tpi_id = !body.tpi_id ? null : body.tpi_id;
        let sql = `select tpi_id,ref_tpi_id,tpi.home_id,mh.home_address,tpi_code
        ,to_char(tpi_datetime,'DD/MM/YYYY HH24:MI:SS') as tpi_datetime,tpi_title,tpi_detail
        ,to_char(receive_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_parcel_datetime
        ,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.receive_parcel_by::integer) as receive_parcel_by
        ,receive_parcel_detail,receive_parcel_data->'image_parcel_receive' as image_parcel_receive
        ,tpi_status,tpi_flag
        ,tpi_remark,company_name
        from t_parcel_info tpi 
        left join m_company mc on tpi.company_id = mc.company_id
        left join m_home mh on tpi.home_id = mh.home_id
        where tpi.delete_flag = 'N' and tpi_status = 'receive_parcel'
        and tpi.company_id = $1
        and tpi_id = $2
        limit 1;`
        const query = {
            text: sql
            , values: [company_id, tpi_id]
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
        else if (res.result.length === 0)
            throw new StatusException(
                {
                    error: this.errMessageUtilsTh.errParcelNotInBase,
                    result: null,
                    message: this.errMessageUtilsTh.errParcelNotInBase,
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

    async getParcelHistory(body: any) {
        const company_id = body.company_id;
        const start_date = body.start_date;
        const end_date = body.end_date;
        const home_address = body.home_address;
        const status_type = !body.status_type ? 'all' : body.status_type;
        let sql = `select tpi_id,ref_tpi_id,tpi.home_id,mh.home_address,tpi_code
        ,to_char(tpi_datetime,'DD/MM/YYYY HH24:MI:SS') as tpi_datetime,tpi_title,tpi_detail
        ,to_char(receive_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_parcel_datetime
        ,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.receive_parcel_by::integer) as receive_parcel_by
        ,receive_parcel_detail,receive_parcel_data->'image_parcel_receive' as image_parcel_receive
		,to_char(send_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as send_parcel_datetime
		,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.send_parcel_by::integer) as send_parcel_by
        ,send_parcel_detail,send_parcel_data->'image_parcel_send' as image_parcel_send
		,to_char(receive_vilager_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_vilager_datetime 
		,(select CONCAT(home_line_first_name,' ',home_line_last_name) from m_home_line where home_line_id = tpi.receive_vilager_by::integer) as receive_vilager_by 
		,receive_vilager_detail
		,tpi_status,tpi_flag
        ,tpi_remark
        from t_parcel_info tpi 
        left join m_company mc on tpi.company_id = mc.company_id
        left join m_home mh on tpi.home_id = mh.home_id
        where tpi.delete_flag = 'N'
        and tpi.company_id = $1
        and receive_parcel_datetime between $2 and $3`
        if (home_address)
            sql += ` and mh.home_address like '%${home_address}%'`
        switch(status_type){
            case 'all':
                sql += ` and tpi_status != $4`
                break;
            default:
                sql += ` and tpi_status = $4`
                break;
        }
            sql += `order by mh.home_address,receive_parcel_datetime,send_parcel_datetime;`
        const query = {
            text: sql
            , values: [company_id, start_date, end_date,status_type]
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
        // else if (res.result.length === 0)
        //     throw new StatusException(
        //         {
        //             error: this.errMessageUtilsTh.errParcelNotInBase,
        //             result: null,
        //             message: this.errMessageUtilsTh.errParcelNotInBase,
        //             statusCode: 200,
        //         },
        //         200);
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

    async getParcelHistoryByID(body: any) {
        const company_id = body.company_id;
        const tpi_id = !body.tpi_id ? null : body.tpi_id;
        let sql = `select tpi_id,ref_tpi_id,tpi.home_id,mh.home_address,tpi_code
        ,to_char(tpi_datetime,'DD/MM/YYYY HH24:MI:SS') as tpi_datetime,tpi_title,tpi_detail
        ,to_char(receive_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_parcel_datetime
        ,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.receive_parcel_by::integer) as receive_parcel_by
        ,receive_parcel_detail,receive_parcel_data->'image_parcel_receive' as image_parcel_receive
		,to_char(send_parcel_datetime,'DD/MM/YYYY HH24:MI:SS') as send_parcel_datetime
		,(select CONCAT(prefix_name_th,' ',first_name_th,' ',last_name_th) from m_employee where employee_id = tpi.send_parcel_by::integer) as send_parcel_by
        ,send_parcel_detail,send_parcel_data->'image_parcel_send' as image_parcel_send
		,to_char(receive_vilager_datetime,'DD/MM/YYYY HH24:MI:SS') as receive_vilager_datetime 
		,(select CONCAT(home_line_first_name,' ',home_line_last_name) from m_home_line where home_line_id = tpi.receive_vilager_by::integer) as receive_vilager_by 
		,receive_vilager_detail
		,tpi_status,tpi_flag
        ,tpi_remark,company_name
        from t_parcel_info tpi 
        left join m_company mc on tpi.company_id = mc.company_id
        left join m_home mh on tpi.home_id = mh.home_id
        where tpi.delete_flag = 'N'
        and tpi.company_id = $1
        and tpi_id = $2
        limit 1;`

        const query = {
            text: sql
            , values: [company_id, tpi_id]
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
        else if (res.result.length === 0)
            throw new StatusException(
                {
                    error: this.errMessageUtilsTh.errParcelNotInBase,
                    result: null,
                    message: this.errMessageUtilsTh.errParcelNotInBase,
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
