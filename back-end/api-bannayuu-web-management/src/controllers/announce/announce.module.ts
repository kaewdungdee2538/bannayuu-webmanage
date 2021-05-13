import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AnnounceAddMiddleware } from 'src/middleware/announce/announce-add.middleware';
import { AnnounceEditMiddleware } from 'src/middleware/announce/announce-edit.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { AnnounceController } from './announce.controller';
import { AnnounceService } from './announce.service';

@Module({
  controllers: [AnnounceController],
  providers: [
    AnnounceService,
    dbConnection,
    FormatDataUtils,
    ErrMessageUtilsTH
  ]
})
export class AnnounceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware, AnnounceEditMiddleware)
      .forRoutes('webbannayuu/api/announce/get-by-id');
    consumer
      .apply(DefaultValueMiddleware, AnnounceEditMiddleware)
      .forRoutes('webbannayuu/api/announce/cancel-announce');
  }


}
