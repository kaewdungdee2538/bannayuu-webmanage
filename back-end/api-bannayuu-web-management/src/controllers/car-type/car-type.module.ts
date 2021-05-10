import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CarTypeController } from './car-type.controller';
import { CarTypeService } from './car-type.service';
import { configfile } from '../../conf/config.json';
import { GetCartypeMiddleware } from 'src/middleware/cartype/get-cartype.middleware';
import { CartypeNameTHMiddleware } from 'src/middleware/cartype/cartype-name-th.middleware';
import { CartypeNameEnMiddleware } from 'src/middleware/cartype/cartype-name-en.middleware';
import { CartypeNameContractionMiddleware } from 'src/middleware/cartype/cartype-name-contraction.middleware';
import { CartypeNameContractionEditMiddleware } from 'src/middleware/cartype/cartype-name-contraction-edit.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';

@Module({
  controllers: [CarTypeController],
  providers: [CarTypeService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CarTypeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/*`);
    consumer
      .apply(GetCartypeMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/get-by-id`);
    consumer
      .apply(CartypeNameTHMiddleware, CartypeNameEnMiddleware, CartypeNameContractionMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/create-cartype`);
    consumer
      .apply(GetCartypeMiddleware, CartypeNameTHMiddleware, CartypeNameEnMiddleware, CartypeNameContractionEditMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/edit-cartype`);
    consumer
      .apply(GetCartypeMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/disable-cartype`);
  }
}
