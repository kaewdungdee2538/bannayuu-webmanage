import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {configfile} from '../../conf/config.json';
import { CardService } from './card.service';

@Controller(`${configfile.url_main_path}/card`)
export class CardController {
    constructor(private readonly cardService:CardService){}

    @Post('get-all')
    @UseGuards(JwtAuthGuard)
    async getCardAll(@Body() body){
        return await this.cardService.getCardAll(body);
    }

    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getCardInfoByCardIDOrName(@Body() body){
        return await this.cardService.getCardInfoByCardIDOrName(body);
    }
    
    @Post('create-card')
    @UseGuards(JwtAuthGuard)
    async createCard(@Body() body,@Request() req){
        return await this.cardService.createCard(body,req);
    }

    @Post('edit-card')
    @UseGuards(JwtAuthGuard)
    async editCard(@Body() body,@Request() req){
        return await this.cardService.editCard(body,req);
    }

    @Post('disable-card')
    @UseGuards(JwtAuthGuard)
    async disableCard(@Body() body,@Request() req){
        return await this.cardService.disableCard(body,req);
    }
    
}
