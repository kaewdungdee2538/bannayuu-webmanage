import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentEventService } from './payment-event.service';

@Controller('webbannayuu/api/payment-event')
export class PaymentEventController {
    constructor(private readonly paymentEventService:PaymentEventService){}
    @UseGuards(JwtAuthGuard)
    @Get('getall')
    getPaymentEventAll(){
        return this.paymentEventService.getPaymentEventAll();
    }
}
