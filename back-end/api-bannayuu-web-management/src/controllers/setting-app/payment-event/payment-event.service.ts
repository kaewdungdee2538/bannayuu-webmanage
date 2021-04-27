import { Injectable } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { StatusException } from 'src/utils/callback.status';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';

@Injectable()
export class PaymentEventService {
    constructor(
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
        private readonly dbconnecttion: dbConnection,
    ) { }

    async getPaymentEventAll() {
        let query = `select payment_event_id,payment_event_name from m_payment_event order by payment_event_name;`

        const res = await this.dbconnecttion.getPgData(query);
        if (res.error) throw new StatusException({
            error: res.error,
            result: null,
            message: this.errMessageUtilsTh.messageProcessFail,
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
