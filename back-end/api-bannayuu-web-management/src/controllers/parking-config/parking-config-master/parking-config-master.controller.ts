import { Body, Controller, Post,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParkingConfigMasterService } from './parking-config-master.service';

@Controller('webbannayuu/api/parking-config-master')
export class ParkingConfigMasterController {
    constructor(private readonly parkingConfigMasterService:ParkingConfigMasterService){}
   
    @Post('create-master')
    @UseGuards(JwtAuthGuard)
    async createParkingMaster(@Body() body,@Request() req){
        return this.parkingConfigMasterService.createParkingMaster(body,req);
    }

    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async getParkingConfigMasterAll(@Body() body){
        return this.parkingConfigMasterService.getParkingConfigMasterAll(body);
    }

    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getParkingConfigMasterById(@Body() body){
        return this.parkingConfigMasterService.getParkingConfigMasterById(body);
    }

    @Post('disable-master')
    @UseGuards(JwtAuthGuard)
    async disableParkingConfigMaster(@Body() body,@Request() req){
        return this.parkingConfigMasterService.disableParkingConfigMaster(body,req);
    }
    
    @Post('edit-master')
    @UseGuards(JwtAuthGuard)
    async editParkingMasterInfo(@Body() body,@Request() req){
        return this.parkingConfigMasterService.editParkingMasterInfo(body,req);
    }
}
