import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { NotificationItemController } from './notification-item.controller';
import { NotificationItemService } from './notification-item.service';

@Module({
  controllers: [NotificationItemController],
  providers: [NotificationItemService,dbConnection,FormatDataUtils,ErrMessageUtilsTH]
})
export class NotificationItemModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes('webbannayuu/api/notification-item/*');
  }
}
