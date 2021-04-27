import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CarAddByHomeIdMiddleware } from 'src/middleware/car/car-addbyhome.middleware';
import { CarEditInfoMiddleware } from 'src/middleware/car/car-editinfo.middleware';
import { GetCarByIdMiddleware } from 'src/middleware/car/car-getbyid.middleware';
import { GetLicensePlateEditMiddleware } from 'src/middleware/car/car-getlicense-edit.middleware';
import { GetLicensePlateMiddleware } from 'src/middleware/car/car-getlicense.middleware';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeSearchByIdMiddleware } from 'src/middleware/home/home-search-byid.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  controllers: [CarController],
  providers: [CarService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CarModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/car/*');
      consumer
      .apply(HomeSearchByIdMiddleware)
      .forRoutes('webbannayuu/api/car/get-byhome');
      consumer
      .apply(GetCarByIdMiddleware)
      .forRoutes('webbannayuu/api/car/get-bycarid');
      consumer
      .apply(HomeSearchByIdMiddleware,CarAddByHomeIdMiddleware,GetLicensePlateMiddleware)
      .forRoutes('webbannayuu/api/car/add-byhome');
      consumer
      .apply(CarAddByHomeIdMiddleware,GetLicensePlateEditMiddleware,CarEditInfoMiddleware)
      .forRoutes('webbannayuu/api/car/edit-info');
      consumer
      .apply(CarEditInfoMiddleware,HomeSearchByIdMiddleware)
      .forRoutes('webbannayuu/api/car/edit-home-change');
  }
}
