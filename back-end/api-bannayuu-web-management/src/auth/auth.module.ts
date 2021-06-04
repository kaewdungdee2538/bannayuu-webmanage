import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DefaultValueMiddleware } from 'src/middleware/default-value/default-value.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { FormatDataUtils } from 'src/utils/format_data.utils';
import { AuthResetMiddleware } from './auth-resetpassword.middleware';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[ JwtModule.register({
    secret: jwtConstants.secret,
    // signOptions: { expiresIn: '1s' },
  }),dbConnection],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,dbConnection,ErrMessageUtilsTH,FormatDataUtils,DefaultValueMiddleware],
  exports:[AuthService, JwtModule]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware,)
      .forRoutes('webbannayuu/api/auth/login');
      consumer
      .apply(DefaultValueMiddleware,AuthResetMiddleware)
      .forRoutes('webbannayuu/api/auth/reset-password');
  }
}
