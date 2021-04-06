import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommonFeeService } from './common-fee.service';

@Controller('webbannayuu/api/common-fee')
export class CommonFeeController {

    constructor(private readonly commonFeeService:CommonFeeService){}

    @UseGuards(JwtAuthGuard)
    @Post('add-common-fee')
    async addCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.addCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('edit-common-fee')
    async editCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.editCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel-common-fee')
    async cancelCommonFee(@Body() body,@Request() req){
        return await this.commonFeeService.cancelCommonFee(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-common-fee-nopay')
    async getCommonFeeNoPay(@Body() body){
        return await this.commonFeeService.getCommonFeeNoPay(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-common-fee-history')
    async getCommonFeeHistory(@Body() body){
        return await this.commonFeeService.getCommonFeeHistory(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-common-fee-byid')
    async getCommonFeeInfoById(@Body() body){
        return await this.commonFeeService.getCommonFeeInfoById(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-common-fee-byid-history')
    async getCommonFeeInfoByIdHistory(@Body() body){
        return await this.commonFeeService.getCommonFeeInfoByIdHistory(body);
    }
}
