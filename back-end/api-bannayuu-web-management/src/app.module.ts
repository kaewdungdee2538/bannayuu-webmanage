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
import { NotificationItemModule } from './controllers/notification-item/notification-item.module';
import { SosModule } from './controllers/sos/sos.module';
import { CommonFeeModule } from './controllers/villager-cost/villager-cost.module';
import { CalculateParkingModule } from './controllers/calculate-parking/calculate-parking.module';
import { PaymentEventModule } from './controllers/setting-app/payment-event/payment-event.module';
import { PaymentHistoryModule } from './controllers/payment/payment-history/payment-history.module';
import { PaymentManagementModule } from './controllers/payment/payment-management/payment-management.module';
import { CarModule } from './controllers/car/car.module';
import { ParkingConfigMasterModule } from './controllers/parking-config/parking-config-master/parking-config-master.module';
import { ParkingConfigHeaderModule } from './controllers/parking-config/parking-config-header/parking-config-header.module';
import { ParkingConfigSubModule } from './controllers/parking-config/parking-config-sub/parking-config-sub.module';

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
    ,NotificationItemModule
    ,SosModule
    ,CommonFeeModule
    ,CalculateParkingModule
    ,PaymentEventModule
    ,PaymentHistoryModule
    ,PaymentManagementModule
    ,CarModule
    ,ParkingConfigMasterModule
    ,ParkingConfigHeaderModule
    ,ParkingConfigSubModule
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
