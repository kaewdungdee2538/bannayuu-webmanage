import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { ParcelGetWaitSendByIDMiddleware } from 'src/middleware/parcel/get/parcel-get-wait-send-byid.middleware';
import { ParcelGetWaitSendMiddleware } from 'src/middleware/parcel/get/parcel-get-wait-send.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';

@Module({
  controllers: [ParcelController],
  providers: [ParcelService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class ParcelModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('/webbannayuu/api/parcel/get/*');
      consumer
      .apply(ParcelGetWaitSendMiddleware)
      .forRoutes('/webbannayuu/api/parcel/get/wait-send');
      consumer
      .apply(ParcelGetWaitSendByIDMiddleware)
      .forRoutes('/webbannayuu/api/parcel/get/wait-send-byid');
      consumer
      .apply(ParcelGetWaitSendMiddleware)
      .forRoutes('/webbannayuu/api/parcel/get/history');
      consumer
      .apply(ParcelGetWaitSendByIDMiddleware)
      .forRoutes('/webbannayuu/api/parcel/get/history-by-id');
  }
}
