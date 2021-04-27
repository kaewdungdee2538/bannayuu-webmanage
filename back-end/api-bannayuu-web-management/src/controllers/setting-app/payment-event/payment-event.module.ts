import { Module } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { PaymentEventController } from './payment-event.controller';
import { PaymentEventService } from './payment-event.service';

@Module({
  controllers: [PaymentEventController],
  providers: [PaymentEventService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class PaymentEventModule {}
