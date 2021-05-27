import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ReceiveParcelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // changing request
    let request = context.switchToHttp().getRequest();
    const employee = request.user.employee;
    request.cookie = {
      action_type: 'RECEIVE'
      , action_type_contrac: 'APLC'
      , type: 'PARCEL'
      , type_contrac: 'APLC'
      , company_id: employee.company_id
    };

    return next.handle().pipe(map(flow => {
      return flow;
    }),
    );
  }
}