import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './controllers/home/home.module';
import { loggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    AuthModule
    ,HomeModule
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
