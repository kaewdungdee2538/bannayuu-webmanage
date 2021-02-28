import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class DefaultValueMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
    ){}
    use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check default value  : ' + messageCheckvalue)
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

    CheckValues(body: any) {
        if(!body.company_id)
            return this.errMessageUrilTh.errCompanyIDNotFound
        else if(this.formatDataUtils.HaveSpecialFormat(body.company_id))
            return this.errMessageUrilTh.errCompanyIDProhibitSpecial
        else if(!this.formatDataUtils.IsNumber(body.company_id))
            return this.errMessageUrilTh.errCompanyIDNotNumber
        // else if(this.formatDataUtils.HaveSpecialFormat(body.company_code))
        //     return this.errMessageUrilTh.errCompanyCodeProhibitSpecial
        // else if(!body.guardhouse_id)
        //     return this.errMessageUrilTh.errGuardHouseIDNotFound
        // else if(this.formatDataUtils.HaveSpecialFormat(body.guardhouse_id))
        //     return this.errMessageUrilTh.errGuardHouseIDProhibitSpecial
        // else if(!this.formatDataUtils.IsNumber(body.guardhouse_id))
        //     return this.errMessageUrilTh.errGuardHouseIDNotNumber
        // else if(this.formatDataUtils.HaveSpecialFormat(body.guardhouse_code))
        //     return this.errMessageUrilTh.errGuardHouseCodeProhibitSpecial
        return null;
    }
};

