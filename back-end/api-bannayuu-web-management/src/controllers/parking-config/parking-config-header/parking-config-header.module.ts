import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GetCartypeMiddleware } from 'src/middleware/cartype/get-cartype.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { NameENMiddleware } from 'src/middleware/name/name-en.middleware';
import { NameTHMiddleware } from 'src/middleware/name/name-th.middleware';
import { ParkingConfigHeaderCreateGetFirstIsDuplicateMiddleware } from 'src/middleware/parking/config-header/parking-config-header-create-get-first-duplicate.middleware';
import { ParkingConfigHeaderCreateGetFirstIsInBaseMiddleware } from 'src/middleware/parking/config-header/parking-config-header-create-get-first-inbase.middleware';
import { ParkingConfigHeaderCreateGetSecondTimeIsDuplicateMiddleware } from 'src/middleware/parking/config-header/parking-config-header-create-get-second-time-duplicate.middleware';
import { ParkingConfigHeaderCreateMiddleware } from 'src/middleware/parking/config-header/parking-config-header-create.middleware';
import { ParkingConfigHeaderEditGetSecondTimeIsDuplicateMiddleware } from 'src/middleware/parking/config-header/parking-config-header-edit-get-second-time-duplicate.middleware';
import { ParkingConfigHeaderFirstGetIdMiddleware } from 'src/middleware/parking/config-header/parking-config-header-first-get-by-id.middleware';
import { ParkingConfigHeaderSecondGetIdMiddleware } from 'src/middleware/parking/config-header/parking-config-header-second-get-by-id.middleware';
import { ParkingConfigMasterGetIdMiddleware } from 'src/middleware/parking/config-master/parking-config-master-get-id.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';
import { TimeZoneMiddleware } from 'src/middleware/time/timezone.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { FuncUtils } from 'src/utils/func.utils';
import { ParkingConfigHeaderController } from './parking-config-header.controller';
import { ParkingConfigHeaderService } from './parking-config-header.service';

@Module({
  controllers: [ParkingConfigHeaderController],
  providers: [ParkingConfigHeaderService, dbConnection, FormatDataUtils, ErrMessageUtilsTH, FuncUtils]
})
export class ParkingConfigHeaderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/*');
      consumer
      .apply(ParkingConfigMasterGetIdMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/check-priority');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/get-all');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, GetCartypeMiddleware, ParkingConfigHeaderCreateGetFirstIsDuplicateMiddleware, NameENMiddleware, NameTHMiddleware, ParkingConfigHeaderCreateMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/create-header-first');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, TimeZoneMiddleware, GetCartypeMiddleware, ParkingConfigHeaderCreateGetFirstIsInBaseMiddleware, NameENMiddleware, NameTHMiddleware, ParkingConfigHeaderCreateMiddleware, ParkingConfigHeaderCreateGetSecondTimeIsDuplicateMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/create-header-second');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, GetCartypeMiddleware, ParkingConfigHeaderFirstGetIdMiddleware, NameENMiddleware, NameTHMiddleware, ParkingConfigHeaderCreateMiddleware,RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/edit-header-first');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, TimeZoneMiddleware, GetCartypeMiddleware, ParkingConfigHeaderCreateGetFirstIsInBaseMiddleware, ParkingConfigHeaderSecondGetIdMiddleware,NameENMiddleware, NameTHMiddleware, ParkingConfigHeaderCreateMiddleware, ParkingConfigHeaderEditGetSecondTimeIsDuplicateMiddleware,RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/edit-header-second');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/disable-header-first');
    consumer
      .apply(ParkingConfigHeaderSecondGetIdMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-header/disable-header-by-id');

  }
}
