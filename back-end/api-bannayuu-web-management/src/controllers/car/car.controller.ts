import { Body, Controller, Post,Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CarService } from './car.service';

@Controller('/webbannayuu/api/car')
export class CarController {
    constructor(private readonly carService:CarService){}
    
    @Post('get-byhome')
    @UseGuards(JwtAuthGuard)
    async getCarByHomeId(@Body() body){
        return this.carService.getCarByHomeId(body);
    }

    @Post('get-bycarid')
    @UseGuards(JwtAuthGuard)
    async getCarByCarId(@Body() body){
        return this.carService.getCarByCarId(body);
    }

    @Post('add-byhome')
    @UseGuards(JwtAuthGuard)
    async addCarByHomeId(@Body() body,@Request() req){
        return this.carService.addCarByHomeId(body,req);
    }

    
    @Post('edit-info')
    @UseGuards(JwtAuthGuard)
    async editCarInfo(@Body() body,@Request() req){
        return this.carService.editCarInfo(body,req);
    }

    @Post('edit-home-change')
    @UseGuards(JwtAuthGuard)
    async editCarHomeChange(@Body() body,@Request() req){
        return this.carService.editCarHomeChange(body,req);
    }
}
