import { Body, Controller, Delete, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnnounceAddInterceptor } from 'src/interceptor/announce/announce-add.interceptor';
import { AnnounceInterceptor } from 'src/interceptor/announce/announce.interceptor';
import { DefaultInterceptor } from 'src/interceptor/default/default-value.interceptor';
import { editFileName, getCurrentDatePathFileSave, imageFileFilter } from 'src/interceptor/images/uploadfile.middleware';
import { dbConnection } from 'src/pg_database/pg.database';
import { ErrMessageUtilsTH } from 'src/utils/err_message_th.utils';
import { AnnounceService } from './announce.service';
import { diskStorage } from 'multer';
import { configfile } from '../../conf/config.json'
import { AnnounceEditInterceptor } from 'src/interceptor/announce/announce-edit.interceptor';
import { ResizeImageInterceptor } from 'src/interceptor/images/resizeimage.interceptor';

@Controller('webbannayuu/api/announce')
export class AnnounceController {
    constructor(
        private readonly announceService: AnnounceService,
        private readonly dbconnection: dbConnection,
        private readonly errMessageUtilsTh: ErrMessageUtilsTH,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('get-all')
    async getAnnounceAll(@Body() body) {
        return await this.announceService.getAnnounceAll(body);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add-announce')
    @UseInterceptors(
        AnnounceInterceptor,
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 }
        ], {
            storage: diskStorage({
                destination: getCurrentDatePathFileSave,
                filename: editFileName,
                
            }),
            fileFilter: imageFileFilter,
            limits: { fileSize: 1024 * 1024 * configfile.image_size_mb }
        }),
        ResizeImageInterceptor,
        DefaultInterceptor,
        AnnounceAddInterceptor
    )
    async addAnnounce(@UploadedFiles() files, @Body() body, @Request() req) {
        const pathMain = configfile.image_path;
        const pathImage = !files.image ? [] : files.image.map(file => {
            const newfilename = file.replace(pathMain, '');
            return newfilename.replace(/\\/g, '/');
        })
        console.log(body)
        console.log(pathImage)
        return await this.announceService.addAnnounce(body, req, pathImage);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-by-id')
    async getAnnounceByID(@Body() body, @Request() req) {
        return await this.announceService.getAnnounceByID(body, req);
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('edit-announce')
    @UseInterceptors(
        AnnounceInterceptor,
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 }
        ], {
            storage: diskStorage({
                destination: getCurrentDatePathFileSave,
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
            limits: { fileSize: 1024 * 1024 * configfile.image_size_mb }
        }),
        ResizeImageInterceptor,
        DefaultInterceptor,
        AnnounceAddInterceptor,
        AnnounceEditInterceptor
    )
    async editAnnounce(@UploadedFiles() files,@Body() body, @Request() req) {
        const pathMain = configfile.image_path;
        let pathImage = null;
        if(files.image){
            pathImage = !files.image ? [] : files.image.map(file => {
                const newfilename = file.replace(pathMain, '');
                return newfilename.replace(/\\/g, '/');
            })
        }
        console.log(body)
        console.log(pathImage)
        return await this.announceService.editAnnounce(body, req,pathImage);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('cancel-announce')
    async cancelAnnounce(@Body() body, @Request() req) {
        return await this.announceService.cancelAnnounce(body, req);
    }
}


