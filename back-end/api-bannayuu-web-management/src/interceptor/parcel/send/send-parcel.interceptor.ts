import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SendParcelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     // changing request
    let request = context.switchToHttp().getRequest();
  
    request.cookie = {
        action_type:'SEND'
        ,action_type_contrac:'APLS'
        ,type:'PARCEL'
        ,type_contrac:'APLS'
    };
    
   return next.handle().pipe(map(flow => {
       return flow;
     }),
   );
  }
}