import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class AnnounceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
     // changing request
    let request = context.switchToHttp().getRequest();
  
    request.cookie = {
        action_type:'ANNOUNCE'
        ,action_type_contrac:'ANC'
        ,type:'ANNOUNCE'
        ,type_contrac:'ANC'
    };
    
   return next.handle().pipe(map(flow => {
       return flow;
     }),
   );
  }
}