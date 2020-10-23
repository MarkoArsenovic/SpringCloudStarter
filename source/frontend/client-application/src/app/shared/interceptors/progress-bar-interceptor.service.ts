import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ProgressBarService } from '../../shared/services/progress-bar.service';



@Injectable({
  providedIn: 'root'
})
export class ProgressBarInterceptorService implements HttpInterceptor {

  constructor(private progressBarService: ProgressBarService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.showProgressBar();

    let requestEndHandled = false;

    const handleRequestEnd = () => {
      if (!requestEndHandled) {
        this.hideProgressBar();
        requestEndHandled = true;
      }
    }

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        handleRequestEnd();
      }
    }, () => {
      // triggered on error
      handleRequestEnd();
    }), finalize(() => {
      // This block is Introduced for cases when HTTP requests get canceled
      // (https://stackoverflow.com/questions/47218216/angular-how-to-know-if-request-has-been-cancelled-in-httpclient)
      handleRequestEnd();
    }));
  }

  showProgressBar() {
    this.progressBarService.httpShow();
  }

  hideProgressBar() {
    this.progressBarService.httpHide();
  }

}
