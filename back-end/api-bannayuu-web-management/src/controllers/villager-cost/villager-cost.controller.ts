import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonFeeService } from './villager-cost.service';

@Controller('webbannayuu/api/villager-cost')
export class CommonFeeController {

    constructor(private readonly commonFeeService:CommonFeeService){}

    @UseGuards(JwtAuthGuard)
    @Post('add-villager-cost')
    async addCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.addCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('edit-villager-cost')
    async editCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.editCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel-villager-cost')
    async cancelCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.cancelCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-villager-cost-nopay')
    async getCommonFeeNoPay(@Body() body){
        return await this.commonFeeService.getCommonFeeNoPay(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-villager-cost-history')
    async getCommonFeeHistory(@Body() body){
        return await this.commonFeeService.getCommonFeeHistory(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-villager-cost-byid')
    async getCommonFeeInfoById(@Body() body){
        return await this.commonFeeService.getCommonFeeInfoById(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-villager-cost-byid-history')
    async getCommonFeeInfoByIdHistory(@Body() body){
        return await this.commonFeeService.getCommonFeeInfoByIdHistory(body);
    }
}
