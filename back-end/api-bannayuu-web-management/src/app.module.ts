import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AnnounceHistoryModule } from './controllers/announce-history/announce-history.module';
import { AnnounceModule } from './controllers/announce/announce.module';
import { EstampAllModule } from './controllers/estamp/estamp-all/estamp-all.module';
import { HomeModule } from './controllers/home/home.module';
import { VillagerModule } from './controllers/villager/villager.module';
import { loggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AuthModule
    ,HomeModule
    ,VillagerModule
    ,AnnounceModule
    ,AnnounceHistoryModule
    ,EstampAllModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware,)
      .forRoutes('*');
  }
}
