import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentHistoryService } from './payment-history.service';

@Controller('webbannayuu/api/payment-history')
export class PaymentHistoryController {
    constructor(private readonly paymentHistoryService:PaymentHistoryService){}
    
    @Post('get-history')
    @UseGuards(JwtAuthGuard)
    async getPaymentHistoryAll(@Body() body){
        return this.paymentHistoryService.getPaymentHistoryAll(body);
    }

    @Post('get-history-by-id')
    @UseGuards(JwtAuthGuard)
    async getPaymentHistoryById(@Body() body){
        return this.paymentHistoryService.getPaymentHistoryById(body);
    }
}
