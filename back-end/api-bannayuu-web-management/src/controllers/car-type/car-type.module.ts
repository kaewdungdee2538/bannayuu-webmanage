import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CarTypeController } from './car-type.controller';
import { CarTypeService } from './car-type.service';
import {configfile} from '../../conf/config.json';

@Module({
  controllers: [CarTypeController],
  providers: [CarTypeService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CarTypeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes(`${configfile.url_main_path}/car-type/*`);
  }
}
