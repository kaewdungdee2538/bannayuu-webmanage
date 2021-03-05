import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { EstampEditMiddleware } from 'src/middleware/estamp/estamp-all/estamp-all-edit.middleware';
import { EstampAllMiddleware } from 'src/middleware/estamp/estamp-all/estamp-all.middleware';
import { EstampGetRecordMiddleware } from 'src/middleware/estamp/get-record/estamp-get-record.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { EstampAllController } from './estamp-all.controller';
import { EstampAllService } from './estamp-all.service';

@Module({
  controllers: [EstampAllController],
  providers: [EstampAllService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class EstampAllModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/estamp-all/*');
    consumer
      .apply(EstampAllMiddleware)
      .forRoutes('webbannayuu/api/estamp-all/getvisitorall');
      consumer
      .apply(EstampGetRecordMiddleware)
      .forRoutes('webbannayuu/api/estamp-all/get-visitor-byid');
      consumer
      .apply(EstampEditMiddleware)
      .forRoutes('webbannayuu/api/estamp-all/edit-estamp');
  }
}
