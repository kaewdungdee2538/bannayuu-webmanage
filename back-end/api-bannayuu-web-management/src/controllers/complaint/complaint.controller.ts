import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ComplaintService } from './complaint.service';

@Controller('webbannayuu/api/complaint')
export class ComplaintController {
    constructor(private readonly complaintService:ComplaintService){}

    @UseGuards(JwtAuthGuard)
    @Post('complaint-notapprove')
    async getComplaintNotApprove(@Body() body){
        return this.complaintService.getComplaintNotApprove(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('complaint-receipt')
    async getComplaintReceipt(@Body() body){
        return this.complaintService.getComplaintReceipt(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('complaint-success')
    async getComplaintSuccess(@Body() body){
        return this.complaintService.getComplaintSuccess(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-byid')
    async getComplaintByID(@Body() body){
        return this.complaintService.getComplaintByID(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save-to-receipt')
    async saveComplaintReceipt(@Body() body,@Request() req){
        return this.complaintService.saveComplaintReceipt(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save-to-reject')
    async saveComplaintReject(@Body() body,@Request() req){
        return this.complaintService.saveComplaintReject(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save-to-success')
    async saveComplaintSuccess(@Body() body,@Request() req){
        return this.complaintService.saveComplaintSuccess(body,req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('save-to-cancel')
    async saveComplaintCancel(@Body() body,@Request() req){
        return this.complaintService.saveComplaintCancel(body,req);
    }
}
