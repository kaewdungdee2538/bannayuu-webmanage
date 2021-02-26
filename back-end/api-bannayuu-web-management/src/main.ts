import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbConnection } from './pg_database/pg.database';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

const connect = new dbConnection;
const port = process.env._PORTAPI || 9045
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ bodyParser:true, cors: true });
  
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(cookieParser());

  await app.listen(port);
  console.log(`API Bannayuu web management running on port : ${port}`)
  await connect.createPgConnect();
}
bootstrap();
