import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dbConnection } from './pg_database/pg.database';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import {configfile} from './conf/config.json';
const connect = new dbConnection;
console.log(JSON.stringify(configfile))
const port = configfile.port_api || 9045
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
