import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { PaymentHistoryByidMiddleware } from 'src/middleware/payment/history/payment-history-get-byid.middleware';
import { TimeMiddleware } from 'src/middleware/time/time.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { PaymentHistoryController } from './payment-history.controller';
import { PaymentHistoryService } from './payment-history.service';

@Module({
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class PaymentHistoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/payment-history/*');
      consumer
      .apply(TimeMiddleware,HomeSearchMiddleware)
      .forRoutes('webbannayuu/api/payment-history/get-history');
      consumer
      .apply(PaymentHistoryByidMiddleware)
      .forRoutes('webbannayuu/api/payment-history/get-history-by-id');
  }
}
