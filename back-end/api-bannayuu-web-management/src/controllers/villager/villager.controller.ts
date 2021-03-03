import { Controller,Request,Body,Post,Delete, UseGuards } from '@nestjs/common';
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
      @Post('get-allhome')
      async getAllHome(@Body() body,@Request() req){
        return await this.villagerService.getAllHome(body);
      }
      
      @UseGuards(JwtAuthGuard)
      @Post('get-all-by-homeid')
      async getVillagerAllByHomeID(@Body() body,@Request() req){
        return await this.villagerService.getVillagerAllByHomeID(body)
      }

      @UseGuards(JwtAuthGuard)
      @Post('add-villager')
      async addVillager(@Body() body,@Request() req){
        return await this.villagerService.addVillager(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Post('get-by-homelineid')
      async getVillagerByLineID(@Body() body,@Request() req){
        return await this.villagerService.getVillagerByLineID(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Post('edit-villager')
      async editVillager(@Body() body,@Request() req){
        return await this.villagerService.editVillager(body,req);
      }

      @UseGuards(JwtAuthGuard)
      @Delete('delete-villager')
      async deleteVillager(@Body() body,@Request() req){
        return await this.villagerService.deleteVillager(body,req);
      }
}
