import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SosService } from './sos.service';

@Controller('webbannayuu/api/sos')
export class SosController {
    constructor(private readonly sosService:SosService){}

    
    @UseGuards(JwtAuthGuard)
    @Post('get-all')
    async getSosInfoAll(@Body() body){
        return this.sosService.getSosInfoAll(body);
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('get-by-id')
    async getSosInfoById(@Body() body){
        return this.sosService.getSosInfoById(body);
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('get-all-history')
    async getSosHistoryInfoAll(@Body() body){
        return this.sosService.getSosHistoryInfoAll(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('corporate-receive')
    async saveCorporateReceive(@Body() body,@Request() req){
        return this.sosService.saveCorporateReceive(body,req)
    }

    @UseGuards(JwtAuthGuard)
    @Post('corporate-reject')
    async saveCorporateReject(@Body() body,@Request() req){
        return this.sosService.saveCorporateReject(body,req)
    }
}
