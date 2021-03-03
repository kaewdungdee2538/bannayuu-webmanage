import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { HomeEditMiddleware } from 'src/middleware/home/home-edit.middleware';
import { VillagerAddMiddleware } from 'src/middleware/villager/villager-add.middleware';
import { VillagerEditMiddleware } from 'src/middleware/villager/villager-edit.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { VillagerController } from './villager.controller';
import { VillagerService } from './villager.service';

@Module({
  controllers: [VillagerController],
  providers: [VillagerService,dbConnection,FormatDataUtils,ErrMessageUtilsTH]
})
export class VillagerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/villager/*');
      consumer
      .apply(HomeEditMiddleware,VillagerAddMiddleware)
      .forRoutes('webbannayuu/api/villager/add-villager');
      consumer
      .apply(HomeEditMiddleware,DefaultValueMiddleware,VillagerEditMiddleware)
      .forRoutes('webbannayuu/api/villager/get-by-homelineid');
      consumer
      .apply(HomeEditMiddleware,VillagerAddMiddleware,VillagerEditMiddleware)
      .forRoutes('webbannayuu/api/villager/edit-villager');
      consumer
      .apply(HomeEditMiddleware,VillagerEditMiddleware)
      .forRoutes('webbannayuu/api/villager/delete-villager');
  }
}
