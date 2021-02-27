import { Controller,Request,Body,Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { VillagerService } from './villager.service';

@Controller('webbannayuu/api/villager')
export class VillagerController {
    constructor(
        private readonly villagerService: VillagerService,
        private readonly dbconnection: dbConnection,
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
      ) {}

      @UseGuards(JwtAuthGuard)
      @Post('get-all-by-homeid')
      async getVillagerAllByHomeID(@Body() body,@Request() req){
        return this.villagerService.getVillagerAllByHomeID(body)
      }
}
