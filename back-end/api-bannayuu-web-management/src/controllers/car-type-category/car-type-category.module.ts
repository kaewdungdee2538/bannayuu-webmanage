import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CarTypeCategoryController } from './car-type-category.controller';
import { CarTypeCategoryService } from './car-type-category.service';
import { configfile } from '../../conf/config.json';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { dbConnection } from 'src/pg_database/pg.database';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { GetCartypeMiddleware } from 'src/middleware/cartype/get-cartype.middleware';
import { GetCartypeCategoryMiddleware } from 'src/middleware/cartype-category/get-cartype-category-id.middleware';
import { CartypeCategoryNameContractionCreateMiddleware } from 'src/middleware/cartype-category/cartype-category-name-contraction.middleware';
import { CartypeNameTHMiddleware } from 'src/middleware/cartype/cartype-name-th.middleware';
import { CartypeNameEnMiddleware } from 'src/middleware/cartype/cartype-name-en.middleware';
import { CartypeCategoryNameContractionEditMiddleware } from 'src/middleware/cartype-category/cartype-category-name-contraction-edit.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';

@Module({
  controllers: [CarTypeCategoryController],
  providers: [CarTypeCategoryService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CarTypeCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/*`);
    consumer
      .apply(GetCartypeMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/get-all`);
    consumer
      .apply(GetCartypeCategoryMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/get-by-id`);
    consumer
      .apply(GetCartypeMiddleware, CartypeNameTHMiddleware, CartypeNameEnMiddleware, CartypeCategoryNameContractionCreateMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/create-category`);
    consumer
      .apply(GetCartypeCategoryMiddleware, CartypeNameTHMiddleware, CartypeNameEnMiddleware, CartypeCategoryNameContractionEditMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/edit-category`);
    consumer
      .apply(GetCartypeCategoryMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type-category/disable-category`);
  }
}
