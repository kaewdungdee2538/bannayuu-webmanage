import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { EstampChangeHomeController } from './estamp-change-home.controller';
import { EstampChangeHomeService } from './estamp-change-home.service';

@Module({
  controllers: [EstampChangeHomeController],
  providers: [EstampChangeHomeService,dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class EstampChangeHomeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/estamp-change-home/*');
    consumer
      .apply()
      .forRoutes('webbannayuu/api/estamp-change-home/get-not-estamp');
    
  }
}
