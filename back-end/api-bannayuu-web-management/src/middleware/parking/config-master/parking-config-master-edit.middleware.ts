import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';

@Injectable()
export class ParkingConfigMasterEditMiddleware implements NestMiddleware {
    constructor(
        private readonly errMessageUrilTh: ErrMessageUtilsTH,
        private readonly formatDataUtils: FormatDataUtils,
        private readonly dbconnection: dbConnection,
    ) { }
    async use(req: Request, res: Response, next: () => void) {
        const messageCheckvalue = await this.CheckValues(req.body)
        if (messageCheckvalue) {
            console.log('Middleware parking config master edit value  : ' + messageCheckvalue)
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
        if (!body.cpm_day_type)
            return this.errMessageUrilTh.errCPMDayTypeNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_day_type))
            return this.errMessageUrilTh.errCPMDayTypeProhitbitSpecial;
        else if (!this.formatDataUtils.checkDayType(body.cpm_day_type))
            return this.errMessageUrilTh.errCPMDayTypeNotInConFig;
        else if (!body.cpm_overnight_status)
            return this.errMessageUrilTh.errCPMOverNightStatusNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_overnight_status))
            return this.errMessageUrilTh.errCPMOverNightStatusProhitbitSpecial;
        else if (body.cpm_fine_amount == null)
            return this.errMessageUrilTh.errCPMOverNightFineAmountNotFound;
        else if (this.formatDataUtils.HaveSpecialFormat(body.cpm_fine_amount))
            return this.errMessageUrilTh.errCPMOverNightFineAmountProhibitSpecial;
        else if (!this.formatDataUtils.IsNumber(body.cpm_fine_amount))
            return this.errMessageUrilTh.errCPMOverNightStatusNotNumber;
        if (body.cpm_time_for_free) {
            if (!await this.formatDataUtils.IsTimeFormat(body.cpm_time_for_free))
                return this.errMessageUrilTh.errCPMTimeForFreeNoFormatTime;
        }
        return await this.checkMasterByDayTypeMatchCarType(body);
    }

    async checkMasterByDayTypeMatchCarType(body: any) {
        const day_type = body.cpm_day_type;
        switch (day_type) {
            case "N":
                const checkCPMNormalDuplicate = await this.checkMasterIsDuplicateMathCartypeAndCPMID(body);
                if (checkCPMNormalDuplicate)
                    return this.errMessageUrilTh.errCPMNormalIsDuplicate;
                return null;
            case "SPECIAL":
                const checkCPMSpecialDuplicate = await this.checkMasterSpecialIsDuplicateMathCartypeAndCPMID(body);
                if (checkCPMSpecialDuplicate)
                    return this.errMessageUrilTh.errCPMSpecialDateIsInRage;
                return null;
            case "WEEKEND":
                const checkCPMWeekendDuplicate = await this.checkMasterIsDuplicateMathCartypeAndCPMID(body);
                if (checkCPMWeekendDuplicate)
                    return this.errMessageUrilTh.errCPMWeekendIsDuplicate;
                return null;
            case "HOLIDAY":
                const checkCPMHolidayDuplicate = await this.checkMasterIsDuplicateMathCartypeAndCPMID(body);
                if (checkCPMHolidayDuplicate)
                    return this.errMessageUrilTh.errCPMHolidayIsDuplicate;
                return null;
            default:
                return 'Day type not valid!';
        }
    }
    async checkMasterSpecialIsDuplicateMathCartypeAndCPMID(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        const cartype_id = body.cartype_id;
        const start_date = body.start_date;
        const stop_date = body.stop_date;
        let sql = `select cpm_id from m_calculate_parking_master
            where delete_flag = 'N' and company_id = $1 and cpm_day_type = 'SPECIAL' and cartype_id = $2
            and ($3 between cpm_start_date and  cpm_stop_date or $4 between cpm_start_date and  cpm_stop_date)
            and cpm_id != $5;`
        const query = {
            text: sql
            , values: [
                company_id, cartype_id
                ,start_date,stop_date
                ,cpm_id
            ]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return true;
        else return false;
    }
    async checkMasterIsDuplicateMathCartypeAndCPMID(body: any) {
        const company_id = body.company_id;
        const cpm_id = body.cpm_id;
        const cartype_id = body.cartype_id;
        const day_type = body.cpm_day_type;
        let sql = `select cpm_id from m_calculate_parking_master
            where delete_flag = 'N' and company_id = $1 and cpm_day_type = $2 and cartype_id = $3
            and cpm_id != $4;`
        const query = {
            text: sql
            , values: [company_id, day_type, cartype_id,cpm_id]
        }
        const res = await this.dbconnection.getPgData(query);
        if (res.error)
            return res.error
        else if (res.result.length > 0)
            return true;
        else return false;
    }
};

