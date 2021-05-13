import { MiddlewareConsumer, Module } from '@nestjs/common';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { configfile } from '../../conf/config.json';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { GetCardByIdMiddleware } from 'src/middleware/card/card-get-by-id.middleware';
import { GetCardAllMiddleware } from 'src/middleware/card/card-get-all.middleware';
import { CreateCardMiddleware } from 'src/middleware/card/card-create.middleware';
import { EditCardMiddleware } from 'src/middleware/card/card-edit.middleware';
import { RemarkMiddleware } from 'src/middleware/remark/remark.middleware';
import { DisableCardMiddleware } from 'src/middleware/card/card-disable.middleware';

@Module({
  controllers: [CardController],
  providers: [CardService, dbConnection, FormatDataUtils, ErrMessageUtilsTH]
})
export class CardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DefaultValueMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/*`);
    consumer
      .apply(GetCardAllMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/get-all`);
    consumer
      .apply(GetCardByIdMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/get-by-id`);
    consumer
      .apply(CreateCardMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/create-card`);
    consumer
      .apply(GetCardByIdMiddleware, EditCardMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/edit-card`);
    consumer
      .apply(GetCardByIdMiddleware,DisableCardMiddleware, RemarkMiddleware)
      .forRoutes(`${configfile.url_main_path}/card/disable-card`);
  }
}
