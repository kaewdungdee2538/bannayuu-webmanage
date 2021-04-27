import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParkingCalculateMasterAddMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware check add parking calculate master value  : ' + messageCheckvalue)
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
        if (!body.cpm_name_th)
            return this.errMessageUrilTh.errCPMNameThNotFound;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.cpm_name_th))
            return this.errMessageUrilTh.errCPMNameThProhitbitSpecial;
        else if (this.formatDataUtils.HaveSpecialHomeFormat(body.cpm_name_en))
            return this.errMessageUrilTh.errCPMNameEnProhitbitSpecial;
        else if (!body.cpm_day_type)
            return this.errMessageUrilTh.errCPMDayTypeNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_day_type))
            return this.errMessageUrilTh.errCPMDayTypeProhitbitSpecial;
        else if (!body.cpm_overnight_status)
            return this.errMessageUrilTh.errCPMOverNightStatusNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_overnight_status))
            return this.errMessageUrilTh.errCPMOverNightStatusProhitbitSpecial
        else if (!body.cpm_fine_amount)
            return this.errMessageUrilTh.errCPMFineAmountNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_fine_amount))
            return this.errMessageUrilTh.errCPMFineAmountProhitbitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.cpm_fine_amount))
            return this.errMessageUrilTh.errCPMFineAmountNotNumber;
        if (body.start_date) {
            if (!await this.formatDataUtils.IsDateTimeFormat(body.start_date))
                return this.errMessageUrilTh.errDateFormNotTimeFormat;
            else if (!body.stop_date)
                return this.errMessageUrilTh.errDateToNotFound
            else if (!await this.formatDataUtils.IsDateTimeFormat(body.stop_date))
                return this.errMessageUrilTh.errDateToNotTimeFormat;
            else if (await this.formatDataUtils.IsTimeStartOverTimeEnd(body.start_date, body.stop_date))
                return this.errMessageUrilTh.errDateFormIsOverDateTo;
        }
        if (body.over_night_start) {
            if (!await this.formatDataUtils.IsTimeFormat(body.over_night_start))
                return this.errMessageUrilTh.errTimeOverNightStartNotTimeFormat
            else if (!body.over_night_stop)
                return this.errMessageUrilTh.errTimeOverNightStartNotFound
            else if (!await this.formatDataUtils.IsTimeFormat(body.over_night_stop))
                return this.errMessageUrilTh.errTimeOverNightEndNotTimeFormat
        }
        if (body.cpm_time_for_free) {
            if (!await this.formatDataUtils.IsTimeFormat(body.cpm_time_for_free))
                return this.errMessageUrilTh.errTimeForFreeNotFormat
        }
        return null;
    }
}
