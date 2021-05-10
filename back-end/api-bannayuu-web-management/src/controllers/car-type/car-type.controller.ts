import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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

    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getCartypeByCartypeId(@Body() body){
        return await this.cartypeService.getCartypeByCartypeId(body);
    }

    @Post('create-cartype')
    @UseGuards(JwtAuthGuard)
    async createCartype(@Body() body,@Request() req){
        return await this.cartypeService.createCartype(body,req);
    }

    @Post('edit-cartype')
    @UseGuards(JwtAuthGuard)
    async editCartype(@Body() body,@Request() req){
        return await this.cartypeService.editCartype(body,req);
    }

    @Post('disable-cartype')
    @UseGuards(JwtAuthGuard)
    async disableCartype(@Body() body,@Request() req){
        return await this.cartypeService.disableCartype(body,req);
    }

    
}
