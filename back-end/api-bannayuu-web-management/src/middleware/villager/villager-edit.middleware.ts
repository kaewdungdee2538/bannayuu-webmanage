
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class VillagerEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection:dbConnection,
    ){}
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware villager edit  : ' + messageCheckvalue)
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
        if(!body.home_line_id)
            return this.errMessageUrilTh.errVillagerNotFound;
        else if(this.formatDataUtils.HaveSpecialFormat(body.home_line_id))
            return this.errMessageUrilTh.errVillagerProhibitSpecial;
        else if(!this.formatDataUtils.IsNumber(body.home_line_id))
            return this.errMessageUrilTh.errVillagerNotNumber;
        return await this.checkHomeLineInBase(body);
    }

    async checkHomeLineInBase(body:any){
        const home_line_id = body.home_line_id;
        const company_id = body.company_id;
        let sql = `select * from m_home_line where home_line_id = $1 and company_id =$2;`
        const query = {
            text:sql
            ,values:[home_line_id,company_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if(res.error)
            return res.error
        else if(res.result.length===0)
            return this.errMessageUrilTh.errVillagerNotInBase;
        else return null;
    }
};