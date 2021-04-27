import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonFeeAddMiddleware } from 'src/middleware/villager-cost/villager-cost-add.middleware';
import { CommonFeeEditMiddleware } from 'src/middleware/villager-cost/villager-cost-edit.middleware';
import { CommonFeeGetMiddleware } from 'src/middleware/villager-cost/villager-cost-get.middleware';
import { CommonFeeGetSearchTypeMiddleware } from 'src/middleware/villager-cost/villager-cost-gettype.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchByIdMiddleware } from 'src/middleware/home/home-search-byid.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { TimeMiddleware } from 'src/middleware/time/time.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CommonFeeController } from './villager-cost.controller';
import { CommonFeeService } from './villager-cost.service';
import { PaymentEventMiddleware } from 'src/middleware/payment-event/payment-event.middleware';

@Module({
  controllers: [CommonFeeController],
  providers: [CommonFeeService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CommonFeeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/*');
    consumer
      .apply(HomeSearchMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/get-villager-cost-nopay', 'webbannayuu/api/villager-cost/get-villager-cost-history');
    consumer
      .apply(CommonFeeGetMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/get-villager-cost-byid', 'webbannayuu/api/villager-cost/edit-villager-cost', 'webbannayuu/api/villager-cost/cancel-villager-cost','webbannayuu/api/villager-cost/get-villager-cost-byid-history');
    consumer
      .apply(CommonFeeAddMiddleware,PaymentEventMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/add-villager-cost');
    consumer
      .apply(CommonFeeEditMiddleware,PaymentEventMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/edit-villager-cost');
      consumer
      .apply(CommonFeeEditMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/cancel-villager-cost');
    consumer
      .apply(TimeMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/get-villager-cost-history');
    consumer
      .apply(CommonFeeGetSearchTypeMiddleware)
      .forRoutes('webbannayuu/api/villager-cost/get-villager-cost-history');
  }
}
