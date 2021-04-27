import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getBlocking():string{
    let date = Date.now();
    let end = Date.now() + 10000;  
    /* Long Job Operation Simulation */  
    while (date < end) {  date = Date.now()  }  
    return 'I am done Block!';
  }

  getNonBlocking():string{
    return 'I am done None!';
  }
}
