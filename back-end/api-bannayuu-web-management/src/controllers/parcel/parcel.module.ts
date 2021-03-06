import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchByIdMiddleware } from 'src/middleware/home/home-search-byid.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { ParcelEditCancelSendedById } from 'src/middleware/parcel/edit/parcel-edit-cancel-sended-byid.middleware';
import { ParcelEditChangeHomeById } from 'src/middleware/parcel/edit/parlce-edit-change-home.middleware';
import { ParcelGetWaitSendByIDMiddleware } from 'src/middleware/parcel/get/parcel-get-wait-send-byid.middleware';
import { ParcelGetWaitSendMiddleware } from 'src/middleware/parcel/get/parcel-get-wait-send.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';

@Module({
  controllers: [ParcelController],
  providers: [ParcelService,
    dbConnection, 
    FormatDataUtils, 
    ErrMessageUtilsTH]
})
export class ParcelModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/parcel/get/*');
      consumer
      .apply(ParcelGetWaitSendMiddleware)
      .forRoutes('webbannayuu/api/parcel/get/wait-send','/webbannayuu/api/parcel/get/sended');
      consumer
      .apply(ParcelGetWaitSendByIDMiddleware)
      .forRoutes('webbannayuu/api/parcel/get/wait-send-byid');
      consumer
      .apply(ParcelGetWaitSendMiddleware)
      .forRoutes('webbannayuu/api/parcel/get/history');
      consumer
      .apply(ParcelGetWaitSendByIDMiddleware)
      .forRoutes('webbannayuu/api/parcel/get/history-by-id');
      consumer
      .apply(DefaultValueMiddleware,HomeSearchByIdMiddleware,ParcelEditChangeHomeById)
      .forRoutes('webbannayuu/api/parcel/change-home');
      consumer
      .apply(DefaultValueMiddleware,ParcelEditChangeHomeById,ParcelEditCancelSendedById)
      .forRoutes('webbannayuu/api/parcel/cancel-send');
  }
}
