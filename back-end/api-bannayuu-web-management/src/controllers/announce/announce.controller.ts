import { Body, Controller, Delete, Get,Post,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { AnnounceService } from './announce.service';

@Controller('webbannayuu/api/announce')
export class AnnounceController {
    constructor(
        private readonly announceService: AnnounceService,
        private readonly dbconnection: dbConnection,
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
      ) {}

      @UseGuards(JwtAuthGuard)
      @Post('get-all')
      async getAnnounceAll(@Body() body){
          return await this.announceService.getAnnounceAll(body);
      }

      @UseGuards(JwtAuthGuard)
      @Post('add-announce')
      async addAnnounce(@Body() body,@Request() req){
          return await this.announceService.addAnnounce(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Post('get-by-id')
      async getAnnounceByID(@Body() body,@Request() req){
          return await this.announceService.getAnnounceByID(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Post('edit-announce')
      async editAnnounce(@Body() body,@Request() req){
          return await this.announceService.editAnnounce(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Delete('cancel-announce')
      async cancelAnnounce(@Body() body,@Request() req){
          return await this.announceService.cancelAnnounce(body,req);
      }
}
