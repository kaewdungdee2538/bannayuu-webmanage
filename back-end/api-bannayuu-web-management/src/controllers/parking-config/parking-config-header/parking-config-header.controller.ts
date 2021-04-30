import { Body,Request, Controller, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParkingConfigHeaderService } from './parking-config-header.service';

@Controller('webbannayuu/api/parking-config-header')
export class ParkingConfigHeaderController {
    constructor(private readonly parkingConfigHeaderService:ParkingConfigHeaderService){}
    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async getParkingConfigHeaderAllByCPMID(@Body() body){
        return await this.parkingConfigHeaderService.getParkingConfigHeaderAllByCPMID(body);
    }

    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getParkingConfigHeaderByCPHID(@Body() body){
        return await this.parkingConfigHeaderService.getParkingConfigHeaderByCPHID(body);
    }

    @Post('create-header-first')
    @UseGuards(JwtAuthGuard)
    async createParkingHeaderFirstRecordByCartype(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.createParkingHeaderFirstRecordByCartype(body,req);
    }

    @Post('create-header-second')
    @UseGuards(JwtAuthGuard)
    async createParkingHeaderSecondRecordByCartype(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.createParkingHeaderSecondRecordByCartype(body,req);
    }

    @Post('edit-header-first')
    @UseGuards(JwtAuthGuard)
    async editParkingHeaderFirstRecordByCartype(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.editParkingHeaderFirstRecordByCartype(body,req);
    }

    @Post('edit-header-second')
    @UseGuards(JwtAuthGuard)
    async editParkingHeaderSecondRecordByCartype(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.editParkingHeaderSecondRecordByCartype(body,req);
    }

    @Post('disable-header-first')
    @UseGuards(JwtAuthGuard)
    async disableParkingHeaderFirst(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.disableParkingHeaderFirst(body,req);
    }
    
    @Post('disable-header-by-id')
    @UseGuards(JwtAuthGuard)
    async disableParkingHeaderWithId(@Body() body,@Request() req){
        return await this.parkingConfigHeaderService.disableParkingHeaderWithId(body,req);
    }

}
