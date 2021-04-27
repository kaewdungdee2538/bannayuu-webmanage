import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkflowPaymentService } from './workflow-payment.service';

@Controller('webbannayuu/api/workflow-payment')
export class WorkflowPaymentController {
    constructor(private readonly workflowPaymentService:WorkflowPaymentService){}
    @UseGuards(JwtAuthGuard)
    @Get('payment')
    getWorkdflowPayment(){
        return this.workflowPaymentService.getWorkdflowPayment();
    }
}
