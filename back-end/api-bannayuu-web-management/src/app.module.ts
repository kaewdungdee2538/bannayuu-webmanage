import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AnnounceHistoryModule } from './controllers/announce-history/announce-history.module';
import { AnnounceModule } from './controllers/announce/announce.module';
import { EstampAllModule } from './controllers/estamp/estamp-all/estamp-all.module';
import { HomeModule } from './controllers/home/home.module';
import { ComplaintModule } from './controllers/complaint/complaint.module';
import { VillagerModule } from './controllers/villager/villager.module';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ParcelModule } from './controllers/parcel/parcel.module';
import { ImageModule } from './controllers/image/image.module';
import { UserProfileModule } from './controllers/user-profile/user-profile.module';
import { EstampChangeHomeModule } from './controllers/estamp/estamp-change-home/estamp-change-home.module';

@Module({
  imports: [
    AuthModule
    ,HomeModule
    ,VillagerModule
    ,AnnounceModule
    ,AnnounceHistoryModule
    ,EstampAllModule
    ,ComplaintModule
    ,ParcelModule
    ,ImageModule
    ,UserProfileModule
    ,EstampChangeHomeModule
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
