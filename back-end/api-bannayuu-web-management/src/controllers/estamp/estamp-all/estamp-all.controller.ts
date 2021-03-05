import { Body, Controller, Post,Request, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EstampAllService } from './estamp-all.service';

@Controller('webbannayuu/api/estamp-all')
export class EstampAllController {
    constructor(private readonly estampAllService:EstampAllService){}
    @UseGuards(JwtAuthGuard)
    @Post('getvisitorall')
    async getVisitorAll(@Body() body,@Request() req){
        return await this.estampAllService.getVisitorAll(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-visitor-byid')
    async getVisitorInfoByID(@Body() body){
        return await this.estampAllService.getVisitorInfoByID(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('edit-estamp')
    async editEstampByID(@Body() body,@Request() req){
        return await this.estampAllService.editEstampByID(body,req);
    }
}
