import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ComplaintGetMiddleware } from 'src/middleware/complaint/complaint-get.middleware';
import { ComplaintSaveNotApproveMiddleware } from 'src/middleware/complaint/complaint-save-notapprove.middleware';
import { ComplaintSearchMiddleware } from 'src/middleware/complaint/complaint-search.middleware';
import { ComplaintGetTimeMiddleware } from 'src/middleware/complaint/complaint-time.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';

@Module({
  controllers: [ComplaintController],
  providers: [ComplaintService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class ComplaintModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/complaint/*');
      consumer
      .apply(ComplaintGetMiddleware)
      .forRoutes('webbannayuu/api/complaint/get-byid');
      consumer
      .apply(ComplaintGetTimeMiddleware,ComplaintSearchMiddleware)
      .forRoutes('/webbannayuu/api/complaint/complaint-notapprove');
      consumer
      .apply(ComplaintGetTimeMiddleware,ComplaintSearchMiddleware)
      .forRoutes('/webbannayuu/api/complaint/complaint-receipt');
      consumer
      .apply(ComplaintGetTimeMiddleware,ComplaintSearchMiddleware)
      .forRoutes('/webbannayuu/api/complaint/complaint-success');
      consumer
      .apply(ComplaintGetMiddleware,ComplaintSaveNotApproveMiddleware)
      .forRoutes('webbannayuu/api/complaint/save-to-receipt'
      ,'webbannayuu/api/complaint/save-to-reject'
      ,'webbannayuu/api/complaint/save-to-success'
      ,'webbannayuu/api/complaint/save-to-cancel');
  }
}
