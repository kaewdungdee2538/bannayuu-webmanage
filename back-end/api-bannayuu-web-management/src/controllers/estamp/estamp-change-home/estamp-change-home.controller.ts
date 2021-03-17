import { Controller, Post,Body,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EstampChangeHomeService } from './estamp-change-home.service';

@Controller('webbannayuu/api/estamp-change-home')
export class EstampChangeHomeController {
    constructor(private readonly estampChangeHomeService:EstampChangeHomeService){}
    @UseGuards(JwtAuthGuard)
    @Post('get-not-estamp')
    async getVisitorNotEstamp(@Body() body){
        return await this.estampChangeHomeService.getVisitorNotEstamp(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-home')
    async changeHomeForVisitor(@Body()body,@Request() req){
        return await this.estampChangeHomeService.changeHomeForVisitor(body);
    }
}
