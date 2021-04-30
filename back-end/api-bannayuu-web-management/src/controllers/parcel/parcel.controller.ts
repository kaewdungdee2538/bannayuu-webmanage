import { Body,Request, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { editFileName, getCurrentDatePathFileSave, imageFileFilter } from 'src/interceptor/images/uploadfile.middleware';
import { ReceiveParcelInterceptor } from 'src/interceptor/parcel/receive/receive-parcel.interceptor';
import { ParcelService } from './parcel.service';
import { diskStorage } from 'multer';
import { ParcelReceiveInterceptor } from 'src/interceptor/parcel/receive/parcel-receive.interceptor';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DefaultInterceptor } from 'src/interceptor/default/default-value.interceptor';
import { HomeInterceptor } from 'src/interceptor/home/home.interceptor';
import {configfile} from '../../conf/config.json'
import { SendParcelInterceptor } from 'src/interceptor/parcel/send/send-parcel.interceptor';
import { ParcelSendInterceptor } from 'src/interceptor/parcel/send/parcel-send.interceptor';
@Controller('webbannayuu/api/parcel')
export class ParcelController {
    constructor(private readonly parcelService:ParcelService){}

    @Post('receive-parcel')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        ReceiveParcelInterceptor,
        FileFieldsInterceptor([
            {name:'image_parcel_receive',maxCount:1}
        ],{
            storage: diskStorage({
                destination: getCurrentDatePathFileSave,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
            limits:{fileSize: 1024*1024*5}
        }),
        DefaultInterceptor,
        ParcelReceiveInterceptor,
        HomeInterceptor
    )
    async addParcelReceive(@UploadedFiles() files, @Body() body,@Request() req){
        const pathMain = configfile.image_path;
        const pathCustomer = !files.image_parcel_receive ? [] : files.image_parcel_receive.map(file=>{
            const newfilename = file.path.replace(pathMain,'');
            return newfilename.replace(/\\/g, '/');
        })
        console.log(body)
        return await this.parcelService.addParcelReceive(body,req,pathCustomer)
    }


    @Post('send-parcel')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        SendParcelInterceptor,
        FileFieldsInterceptor([
            {name:'image_parcel_send',maxCount:1}
        ],{
            storage: diskStorage({
                destination: getCurrentDatePathFileSave,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
            limits:{fileSize: 1024*1024*5}
        }),
        DefaultInterceptor,
        ParcelSendInterceptor
    )
    async addParcelSend(@UploadedFiles() files, @Body() body,@Request() req){
        const pathMain = configfile.image_path;
        const pathCustomer = !files.image_parcel_send ? [] : files.image_parcel_send.map(file=>{
            const newfilename = file.path.replace(pathMain,'');
            return newfilename.replace(/\\/g, '/');
        })
        return await this.parcelService.addParcelSend(body,req,pathCustomer)
    }

    @Post('reject-parcel')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        SendParcelInterceptor,
        FileFieldsInterceptor([
            {name:'image_parcel_send',maxCount:1}
        ],{
            storage: diskStorage({
                destination: getCurrentDatePathFileSave,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
            limits:{fileSize: 1024*1024*5}
        }),
        DefaultInterceptor,
        ParcelSendInterceptor
    )
    async addParcelReject(@UploadedFiles() files, @Body() body,@Request() req){
        const pathMain = configfile.image_path;
        const pathCustomer = !files.image_parcel_send ? [] : files.image_parcel_send.map(file=>{
            const newfilename = file.path.replace(pathMain,'');
            return newfilename.replace(/\\/g, '/');
        })
        return await this.parcelService.addParcelReject(body,req,pathCustomer)
    }

    @Post('get/wait-send')
    @UseGuards(JwtAuthGuard)
    async getParcelWaitToSend(@Body() body){
        return this.parcelService.getParcelWaitToSend(body);
    }

    @Post('get/wait-send-byid')
    @UseGuards(JwtAuthGuard)
    async getParcelWaitToSendByID(@Body() body){
        return this.parcelService.getParcelWaitToSendByID(body);
    }

    @Post('get/history')
    @UseGuards(JwtAuthGuard)
    async getParcelHistory(@Body() body){
        return this.parcelService.getParcelHistory(body);
    }

    @Post('get/history-by-id')
    @UseGuards(JwtAuthGuard)
    async getPacelHistoryByID(@Body() body){
        return this.parcelService.getParcelHistoryByID(body);
    }

    @Post('get/sended')
    @UseGuards(JwtAuthGuard)
    async getParcelSended(@Body() body){
        return this.parcelService.getParcelSended(body);
    }

    @Post('change-home')
    @UseGuards(JwtAuthGuard)
    async saveParcelChangeHome(@Body() body,@Request() req){
        return this.parcelService.saveParcelChangeHome(body,req);
    }

    @Post('cancel-send')
    @UseGuards(JwtAuthGuard)
    async saveParcelCancelSend(@Body() body,@Request() req){
        return this.parcelService.saveParcelCancelSend(body,req);
    }
}
