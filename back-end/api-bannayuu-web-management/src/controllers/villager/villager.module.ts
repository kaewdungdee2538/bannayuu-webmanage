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
      .apply(DefaultValueMiddleware,HomeEditMiddleware)
      .forRoutes('webbannayuu/api/villager/*');
      consumer
      .apply(VillagerAddMiddleware)
      .forRoutes('webbannayuu/api/villager/add-villager');
      consumer
      .apply(DefaultValueMiddleware,HomeEditMiddleware,VillagerEditMiddleware)
      .forRoutes('webbannayuu/api/villager/get-by-homelineid');
      consumer
      .apply(VillagerAddMiddleware,VillagerEditMiddleware)
      .forRoutes('webbannayuu/api/villager/edit-villager');
  }
}
