import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonFeeAddMiddleware } from 'src/middleware/common-fee/common-fee-add.middleware';
import { CommonFeeEditMiddleware } from 'src/middleware/common-fee/common-fee-edit.middleware';
import { CommonFeeGetMiddleware } from 'src/middleware/common-fee/common-fee-get.middleware';
import { CommonFeeGetSearchTypeMiddleware } from 'src/middleware/common-fee/common-fee-gettype.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchByIdMiddleware } from 'src/middleware/home/home-search-byid.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { TimeMiddleware } from 'src/middleware/time/time.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CommonFeeController } from './common-fee.controller';
import { CommonFeeService } from './common-fee.service';

@Module({
  controllers: [CommonFeeController],
  providers: [CommonFeeService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CommonFeeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/common-fee/*');
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/common-fee/*');
    consumer
      .apply(HomeSearchMiddleware)
      .forRoutes('webbannayuu/api/common-fee/get-common-fee-nopay', 'webbannayuu/api/common-fee/get-common-fee-history');
    consumer
      .apply(CommonFeeGetMiddleware)
      .forRoutes('webbannayuu/api/common-fee/get-common-fee-byid', 'webbannayuu/api/common-fee/edit-common-fee', 'webbannayuu/api/common-fee/cancel-common-fee','webbannayuu/api/common-fee/get-common-fee-byid-history');
    consumer
      .apply(CommonFeeAddMiddleware)
      .forRoutes('webbannayuu/api/common-fee/add-common-fee');
    consumer
      .apply(CommonFeeEditMiddleware)
      .forRoutes('webbannayuu/api/common-fee/edit-common-fee', 'webbannayuu/api/common-fee/cancel-common-fee');
    consumer
      .apply(TimeMiddleware)
      .forRoutes('webbannayuu/api/common-fee/get-common-fee-history');
    consumer
      .apply(CommonFeeGetSearchTypeMiddleware)
      .forRoutes('webbannayuu/api/common-fee/get-common-fee-history');
  }
}
