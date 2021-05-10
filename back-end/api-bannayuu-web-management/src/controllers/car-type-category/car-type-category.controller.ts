import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {configfile} from '../../conf/config.json';
import { CarTypeCategoryService } from './car-type-category.service';

@Controller(`${configfile.url_main_path}/car-type-category`)
export class CarTypeCategoryController {
    constructor(private readonly cartypeCategoryService:CarTypeCategoryService){}

    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async getCartypeCategoryAll(@Body() body){
        return await this.cartypeCategoryService.getCartypeCategoryAll(body);
    }

    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getCartypeCategoryById(@Body() body){
        return await this.cartypeCategoryService.getCartypeCategoryById(body);
    }

    @Post('create-category')
    @UseGuards(JwtAuthGuard)
    async createCartypeCategory(@Body() body,@Request() req){
        return await this.cartypeCategoryService.createCartypeCategory(body,req);
    }

    @Post('edit-category')
    @UseGuards(JwtAuthGuard)
    async editCartypeCategory(@Body() body,@Request() req){
        return await this.cartypeCategoryService.editCartypeCategory(body,req);
    }

    @Post('disable-category')
    @UseGuards(JwtAuthGuard)
    async disableCartypeCategory(@Body() body,@Request() req){
        return await this.cartypeCategoryService.disableCartypeCategory(body,req);
    }
}
