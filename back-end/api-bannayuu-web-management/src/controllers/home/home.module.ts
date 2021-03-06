import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeEditMiddleware } from 'src/middleware/home/home-edit.middleware';
import { HomeInfoMiddleware } from 'src/middleware/home/home-info.middleware';
import { HomeSearchAddressLkeMiddleware } from 'src/middleware/home/home-search-address-like.middleware';
import { HomeSearchMiddleware } from 'src/middleware/home/home-search.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class HomeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/home/*');
      consumer
      .apply(HomeSearchAddressLkeMiddleware)
      .forRoutes('webbannayuu/api/home/get-all', 'webbannayuu/api/home/get-all-not-disable');
    consumer
      .apply(HomeInfoMiddleware)
      .forRoutes('webbannayuu/api/home/add-home');
    consumer
      .apply(HomeInfoMiddleware, HomeEditMiddleware)
      .forRoutes('webbannayuu/api/home/edit-home');
    consumer
      .apply(HomeEditMiddleware)
      .forRoutes('webbannayuu/api/home/get-home-by-id');
  }
}
