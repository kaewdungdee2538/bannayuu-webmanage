import { Controller, Get, Res, Param, Request,Query } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('webbannayuu/api/image')
export class ImageController {
    constructor(private readonly imageService: ImageService) { }
    @Get()
    getImage(@Query() param, @Res() res) {
        return this.imageService.getImageWithPathFile(param.path, res);
    }
}
