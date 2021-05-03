import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CarTypeService } from './car-type.service';
import {configfile} from '../../conf/config.json';

@Controller(`${configfile.url_main_path}/car-type`)
export class CarTypeController {

    constructor(private readonly cartypeService:CarTypeService){}
    
    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async getCarTypeByCompant_id(@Body() body){
        return await this.cartypeService.getCarTypeByCompant_id(body);
    }
}
