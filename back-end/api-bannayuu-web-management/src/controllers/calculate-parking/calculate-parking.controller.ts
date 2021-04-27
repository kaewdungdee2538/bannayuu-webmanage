import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CalculateParkingService } from './calculate-parking.service';

@Controller('webbannayuu/api/calculate-parking')
export class CalculateParkingController {
    constructor(private calculateParkingService:CalculateParkingService){}
    
    @UseGuards(JwtAuthGuard)
    @Post('get-master-all')
    async getCalculateParkingMasterSettingAll(@Body() body){
        return await this.calculateParkingService.getCalculateParkingMasterSettingAll(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-master-by-id')
    async getCalculateParkingMasterSettingByID(@Body() body){
        return await this.calculateParkingService.getCalculateParkingMasterSettingByID(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-master') async addCalculateParkingMaster(@Body() body,@Request() req){
        return await this.calculateParkingService.addCalculateParkingMaster(body,req);
    }
}
