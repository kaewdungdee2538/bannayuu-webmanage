import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { PaymentHistoryByidMiddleware } from 'src/middleware/payment/history/payment-history-get-byid.middleware';
import { PaymentManagementApproveMiddleware } from 'src/middleware/payment/management/payment-management-approve.middleware';
import { PaymentManagementCancelMiddleware } from 'src/middleware/payment/management/payment-management-cancel.middleware';
import { PaymentManagementGetByidMiddleware } from 'src/middleware/payment/management/payment-management-get.middleware';
import { PaymentScheduleGetCodeMiddleware } from 'src/middleware/payment/management/payment-schedule-get-code.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { PaymentManagementController } from './payment-management.controller';
import { PaymentManagementService } from './payment-management.service';

@Module({
  controllers: [PaymentManagementController],
  providers: [PaymentManagementService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class PaymentManagementModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/payment-management/*');
      consumer
      .apply(HomeSearchMiddleware)
      .forRoutes('/webbannayuu/api/payment-management/get-management');
      consumer
      .apply(PaymentManagementGetByidMiddleware)
      .forRoutes('webbannayuu/api/payment-management/get-management-by-id');

      consumer
      .apply(
        PaymentManagementGetByidMiddleware,
        PaymentManagementApproveMiddleware,
        PaymentScheduleGetCodeMiddleware,
        )
      .forRoutes('webbannayuu/api/payment-management/approve-payment');
      consumer
      .apply(
        PaymentManagementGetByidMiddleware,
        PaymentManagementCancelMiddleware,
        PaymentScheduleGetCodeMiddleware,
        )
      .forRoutes('webbannayuu/api/payment-management/reject-payment');
  }
}
