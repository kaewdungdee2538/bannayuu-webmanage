import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { SosGetInfoById } from 'src/middleware/sos/get/sos-get-info-by-id.middleware';
import { SosSaveGetInfoById } from 'src/middleware/sos/save/sos-save-get-by-id.middleware';
import { TimeMiddleware } from 'src/middleware/time/time.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { SosController } from './sos.controller';
import { SosService } from './sos.service';

@Module({
  controllers: [SosController],
  providers: [SosService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class SosModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/sos/*');
    consumer
      .apply(TimeMiddleware, HomeSearchMiddleware)
      .forRoutes('webbannayuu/api/sos/get-all', 'webbannayuu/api/sos/get-all-history');
    consumer
      .apply(SosGetInfoById)
      .forRoutes('webbannayuu/api/sos/get-by-id');
    consumer
      .apply(SosSaveGetInfoById)
      .forRoutes('webbannayuu/api/sos/corporate-receive');
  }
}
