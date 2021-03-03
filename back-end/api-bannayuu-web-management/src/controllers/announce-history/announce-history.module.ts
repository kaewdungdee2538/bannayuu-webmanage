import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AnnounceHistoryNormalMiddleware } from 'src/middleware/announce-history/announce-history-normal.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { AnnounceHistoryController } from './announce-history.controller';
import { AnnounceHistoryService } from './announce-history.service';

@Module({
  controllers: [AnnounceHistoryController],
  providers: [AnnounceHistoryService,dbConnection,FormatDataUtils,ErrMessageUtilsTH]
})
export class AnnounceHistoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/announce-history/*');
      consumer
      .apply(AnnounceHistoryNormalMiddleware)
      .forRoutes('webbannayuu/api/announce-history/get-normal');
  }
}
