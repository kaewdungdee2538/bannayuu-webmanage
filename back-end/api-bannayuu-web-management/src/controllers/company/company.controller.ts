import { Controller,Post,Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import {configfile} from '../../conf/config.json';

@Controller(`${configfile.url_main_path}/company`)
export class CompanyController {
    constructor(private readonly companyService:CompanyService){}
    @Post('get-company-list')
    @UseGuards(JwtAuthGuard)
    async getCompanyList(@Body() body){
        return await this.companyService.getCompanyList(body);
    }
}
