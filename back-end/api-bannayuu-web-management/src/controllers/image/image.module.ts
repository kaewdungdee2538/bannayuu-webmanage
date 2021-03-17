import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import {configfile} from '../../conf/config.json'
@Module({
  
  controllers: [ImageController],
  providers: [ImageService,ErrMessageUtilsTH]
})
export class ImageModule {

}
