import { Body, Controller, Post,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParkingConfigSubService } from './parking-config-sub.service';

@Controller('webbannayuu/api/parking-config-sub')
export class ParkingConfigSubController {
    constructor(private readonly parkingConfigSubService:ParkingConfigSubService){}

    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async createParkingMaster(@Body() body){
        return this.parkingConfigSubService.getParkingConfigSubAllByCphID(body);
    }
    
    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getParkingConfigSubByCpsID(@Body() body){
        return this.parkingConfigSubService.getParkingConfigSubByCpsID(body);
    }

    @Post('create-sub')
    @UseGuards(JwtAuthGuard)
    async createParkingSubRecordByCphId(@Body() body,@Request() req){
        return this.parkingConfigSubService.createParkingSubRecordByCphId(body,req);
    }

    @Post('edit-sub')
    @UseGuards(JwtAuthGuard)
    async editParkingSubRecordByCphId(@Body() body,@Request() req){
        return this.parkingConfigSubService.editParkingSubRecordByCphId(body,req);
    }

    @Post('disable-sub')
    @UseGuards(JwtAuthGuard)
    async disableParkingSubRecordByCphId(@Body() body,@Request() req){
        return this.parkingConfigSubService.disableParkingSubRecordByCphId(body,req);
    }
}
