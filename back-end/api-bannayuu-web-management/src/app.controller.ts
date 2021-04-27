import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/block')
  getBlocking():string{
    return this.appService.getBlocking();
  }

  @Get('/non-block')
  getNonBlocking():string{
    return this.appService.getNonBlocking();
  }
}
