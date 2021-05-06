import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { ParkingConfigHeaderGetIdMiddleware } from 'src/middleware/parking/config-header/parking-config-header-get-by-id.middleware';
import { ParkingConfigHeaderSecondGetIdMiddleware } from 'src/middleware/parking/config-header/parking-config-header-second-get-by-id.middleware';
import { ParkingConfigSubCreateMiddleware } from 'src/middleware/parking/config-sub/parking-config-sub-create.middleware';
import { ParkingConfigSubEditMiddleware } from 'src/middleware/parking/config-sub/parking-config-sub-edit.middleware';
import { ParkingConfigSubGetByIdInBaseMiddleware } from 'src/middleware/parking/config-sub/parking-config-sub-get-by-id-inbase.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';
import { IntervalMiddleware } from 'src/middleware/time/interval.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { FuncUtils } from 'src/utils/func.utils';
import { ParkingConfigSubController } from './parking-config-sub.controller';
import { ParkingConfigSubService } from './parking-config-sub.service';

@Module({
  controllers: [ParkingConfigSubController],
  providers: [ParkingConfigSubService, dbConnection, FormatDataUtils, ErrMessageUtilsTH, FuncUtils]
})
export class ParkingConfigSubModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/*');
    consumer
      .apply(ParkingConfigHeaderGetIdMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/get-all');
    consumer
      .apply(ParkingConfigSubGetByIdInBaseMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/get-by-id');
    consumer
      .apply(ParkingConfigHeaderGetIdMiddleware, IntervalMiddleware, ParkingConfigSubCreateMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/create-sub');
    consumer
      .apply(ParkingConfigSubGetByIdInBaseMiddleware, ParkingConfigHeaderGetIdMiddleware, IntervalMiddleware, ParkingConfigSubEditMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/edit-sub');
    consumer
      .apply(ParkingConfigSubGetByIdInBaseMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/disable-sub');
    consumer
      .apply(ParkingConfigSubGetByIdInBaseMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-sub/disable-sub');
    
  }
}
