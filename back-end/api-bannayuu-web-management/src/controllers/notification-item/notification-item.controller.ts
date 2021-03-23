import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationItemService } from './notification-item.service';

@Controller('webbannayuu/api/notification-item')
export class NotificationItemController {
    constructor(private readonly notificationItemService:NotificationItemService){}
    @UseGuards(JwtAuthGuard)
    @Post('get-all')
    getNotiItemAll(@Body() body){
        return this.notificationItemService.getNotiItemAll(body);
    }
}
