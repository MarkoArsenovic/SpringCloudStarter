import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CustomizedHttpErrorResponse } from '../models/customized-http-error-response';
import { AUTHORIZATION_HEADER_KEY, PUBLIC_ROUTES } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isDialogOpened = false;
  private dialogSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(public authenticationService: AuthenticationService, public dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError((error: CustomizedHttpErrorResponse) => {
      if (error instanceof CustomizedHttpErrorResponse && error.status === 410) {

        if (!this.isDialogOpened) {
          return this.openConfirmRefreshDialog(request, next, error);

        } else {
          return this.dialogSubject.pipe(
            filter(dialogClosed => dialogClosed !== null),
            take(1),
            switchMap(() => {
              return this.handle410Error(request, next);
            }));
        }

       
      } else {
        return throwError(error);
      }
    }));
  }

  private openConfirmRefreshDialog(request, next, error) {

    this.isDialogOpened = true;
    this.dialogSubject.next(null);

    return this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      disableClose: true,
      data: 
      { message: 'Your login session has expired. Please refresh the session to continue using the application.',
        buttonLabels: {
          confirm: 'Refresh Session',
          cancel: 'Logout'
        }
      }
    }).afterClosed().pipe(
      switchMap((res: any) => {
        if (res) {
          this.isDialogOpened = false;
          this.dialogSubject.next(true)
          return this.handle410Error(request, next);
        } else {
          this.isDialogOpened = false;
          this.authenticationService.logout();

          if (error instanceof CustomizedHttpErrorResponse) {
            error.customFields.blockMessageShowing = true;
          }

          // return EMPTY;
          // Probably better to return error, because EMPTY will prevent individual error handlers to execute their code.
          return throwError(error);
        }
      })
    )

  }

  /**
   * Inspired by this tutorial https://angular-academy.com/angular-jwt/ (same tutorial on youtube: https://www.youtube.com/watch?v=F1GUjHPpCLA)
   */
  private handle410Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authenticationService.refreshLoginToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);

          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(error);

          if (error instanceof CustomizedHttpErrorResponse && error.status === 401){
            /**
            * This request is being resent on purpose here, so its error handler can execute its code.
            * However its error message should not be shown because it would override the "Session has expired..."
            * generic message sent from backend.
            */
            return next.handle(request).pipe(catchError((error: CustomizedHttpErrorResponse) => {

              if (error instanceof CustomizedHttpErrorResponse) {
                error.customFields.blockMessageShowing = true;
              }
              
              return throwError(error);

            }));
          }

          return throwError(error);
        })
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(data => {

          const publicRoutes = PUBLIC_ROUTES;
          const requestUrl = request.url;

          let isProtectedRoute: boolean = true;

          for (const publicRoute in publicRoutes) {
            if (publicRoutes.hasOwnProperty(publicRoute)) {
              if (requestUrl.includes(publicRoutes[publicRoute])) {
                isProtectedRoute = false;
                break;
              }
            }
          }

          /**
           * Error messages of requests that are on hold, should not be displayed if the first request that got to the server
           * gets 401 (which is currently the status that logs out the user). In addition there is a condition
           * that these must be protected routes requests (requests that need authentication). If these messages were shown,
           * they would override the "Session has expired..." message that 401 request contains. That is why their displaying is blocked here.
           */
          if (isProtectedRoute && data instanceof CustomizedHttpErrorResponse && data.status === 401){
            /**
             * These requests are being resent on purpose here, so their error handlers can execute their code.
             */
            return next.handle(request).pipe(catchError((error: CustomizedHttpErrorResponse) => {

              if (error instanceof CustomizedHttpErrorResponse) {
                error.customFields.blockMessageShowing = true;
              }
              
              return throwError(error);

            }));
          } else {
            return next.handle(this.addToken(request, data));
          }
        }));
    }

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`
      }
    });
  }
}
