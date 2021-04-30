import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GetCartypeNotNullMiddleware } from 'src/middleware/cartype/get-cartype-notnull.middleware';
import { GetCartypeMiddleware } from 'src/middleware/cartype/get-cartype.middleware';
import { DateMiddleware } from 'src/middleware/date/date.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { NameENMiddleware } from 'src/middleware/name/name-en.middleware';
import { NameTHMiddleware } from 'src/middleware/name/name-th.middleware';
import { ParkingConfigMasterEditMiddleware } from 'src/middleware/parking/config-master/parking-config-master-edit.middleware';
import { ParkingConfigMasterGetIdMiddleware } from 'src/middleware/parking/config-master/parking-config-master-get-id.middleware';
import { ParkingConfigMasterMiddleware } from 'src/middleware/parking/config-master/parking-config-master.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';
import { TimeOvernightMiddleware } from 'src/middleware/time/time-overnight.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { ParkingConfigMasterController } from './parking-config-master.controller';
import { ParkingConfigMasterService } from './parking-config-master.service';

@Module({
  controllers: [ParkingConfigMasterController],
  providers: [ParkingConfigMasterService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})

export class ParkingConfigMasterModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/*');
    consumer
      .apply(GetCartypeNotNullMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/get-all');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/get-by-id');
    consumer
      .apply(ParkingConfigMasterMiddleware, GetCartypeMiddleware, NameENMiddleware, NameTHMiddleware, DateMiddleware, TimeOvernightMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/create-master');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware,ParkingConfigMasterEditMiddleware, GetCartypeMiddleware, NameENMiddleware, NameTHMiddleware, DateMiddleware, TimeOvernightMiddleware,RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/edit-master');
    consumer
      .apply(ParkingConfigMasterGetIdMiddleware, RemarkMiddleware)
      .forRoutes('webbannayuu/api/parking-config-master/disable-master');
  }
}
