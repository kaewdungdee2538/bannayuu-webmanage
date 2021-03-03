import { Controller, Post,Body,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { AnnounceHistoryService } from './announce-history.service';

@Controller('webbannayuu/api/announce-history')
export class AnnounceHistoryController {
    constructor(
        private readonly announceHistoryService: AnnounceHistoryService,
        private readonly dbconnection: dbConnection,
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
      ) {}

      @UseGuards(JwtAuthGuard)
      @Post('get-normal')
      async getNormal(@Body() body,@Request() req){
        return await this.announceHistoryService.getNormal(body);
      }
}
