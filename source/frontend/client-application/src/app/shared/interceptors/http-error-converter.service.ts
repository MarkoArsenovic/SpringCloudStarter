import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CustomizedHttpErrorResponse } from '../models/customized-http-error-response';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorConverterService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {

        const error = new CustomizedHttpErrorResponse(err)
        return throwError(error)

      })
    )

  }
  
}
