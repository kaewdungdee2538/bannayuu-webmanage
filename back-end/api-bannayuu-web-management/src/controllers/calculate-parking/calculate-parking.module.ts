import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GetCartypeMiddleware } from 'src/middleware/cartype/get-cartype.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { ParkingCalculateMasterAddMiddleware } from 'src/middleware/parking-calculate/master/parking-calculate-maste-add.middleware';
import { ParkingCalculateMasterGetMiddleware } from 'src/middleware/parking-calculate/master/parking-calculate-master-get.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CalculateParkingController } from './calculate-parking.controller';
import { CalculateParkingService } from './calculate-parking.service';

@Module({
  controllers: [CalculateParkingController],
  providers: [CalculateParkingService,dbConnection,FormatDataUtils,ErrMessageUtilsTH]
})
export class CalculateParkingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/calculate-parking/*');
      consumer
      .apply(ParkingCalculateMasterGetMiddleware)
      .forRoutes('webbannayuu/api/calculate-parking/get-master-by-id');
      consumer
      .apply(GetCartypeMiddleware,ParkingCalculateMasterAddMiddleware)
      .forRoutes('webbannayuu/api/calculate-parking/add-master');

  }
}
