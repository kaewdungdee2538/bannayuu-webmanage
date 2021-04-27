import { Body, Controller, Post, UseGuards,Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentManagementService } from './payment-management.service';

@Controller('/webbannayuu/api/payment-management')
export class PaymentManagementController {
    constructor(private readonly paymentManagementService:PaymentManagementService){}
    @Post('get-management')
    @UseGuards(JwtAuthGuard)
    async getPaymentManagementAll(@Body() body){
        return this.paymentManagementService.getPaymentManagementAll(body);
    }

    @Post('get-management-by-id')
    @UseGuards(JwtAuthGuard)
    async getPaymentManagementById(@Body() body){
        return this.paymentManagementService.getPaymentManagementById(body);
    }

    @Post('approve-payment')
    @UseGuards(JwtAuthGuard)
    async approvePaymentVillager(@Body() body,@Request() req){
        return this.paymentManagementService.approvePaymentVillager(body,req);
    }

    @Post('reject-payment')
    @UseGuards(JwtAuthGuard)
    async rejectPaymentVillager(@Body() body,@Request() req){
        return this.paymentManagementService.rejectPaymentVillager(body,req);
    }
}
