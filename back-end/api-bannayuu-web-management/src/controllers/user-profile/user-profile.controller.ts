import { Body,Request, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserProfileService } from './user-profile.service';

@Controller('/webbannayuu/api/user-profile')
export class UserProfileController {
    constructor(private readonly userProfileService:UserProfileService){}
    @Post('get-by-id')
    @UseGuards(JwtAuthGuard)
    async getUserProfileByID(@Body() body,@Request() req){
        return this.userProfileService.getUserProfileByID(body,req);
    }
}
