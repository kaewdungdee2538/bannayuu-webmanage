
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class VillagerAddMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection:dbConnection,
    ){}
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware villager add  : ' + messageCheckvalue)
            res.send({
                response: {
                    error: messageCheckvalue
                    , result: null
                    , message: messageCheckvalue
                    , statusCode: 200
                }
            });
        } else
            next();
    }

   async CheckValues(body: any) {
        if(!body.home_line_first_name)
            return this.errMessageUrilTh.errFirstNameNotFound
        else if(this.formatDataUtils.HaveSpecialNameFormat(body.home_line_first_name))
            return this.errMessageUrilTh.errFirstNameProhitbitSpecial
        else if(!body.home_line_last_name)
            return this.errMessageUrilTh.errLastNameNotFound
        else if(this.formatDataUtils.HaveSpecialNameFormat(body.home_line_last_name))
            return this.errMessageUrilTh.errLastNameProhitbitSpecial
        else if(!body.home_line_mobile_phone)
            return this.errMessageUrilTh.errMobilePhoneNotFound
        else if(this.formatDataUtils.HaveSpecialFormat(body.home_line_mobile_phone))
            return this.errMessageUrilTh.errMobilePhoneProhitbitSpecial
        else if(!this.formatDataUtils.IsNumber(body.home_line_mobile_phone))
            return this.errMessageUrilTh.errMobilePhoneNotNumber
        return await this.checkHomeInBase(body);
    }

    async checkHomeInBase(body:any){
        const home_id = body.home_id;
        const company_id = body.company_id;
        let sql = `select * from m_home where delete_flag = 'N' and home_id = $1 and company_id =$2;`
        const query = {
            text:sql
            ,values:[home_id,company_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errHomeIDNotInDataBase;
        else return null;
    }
};