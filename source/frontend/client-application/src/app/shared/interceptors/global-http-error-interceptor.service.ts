import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { GlobalErrorHandlerService } from '../services/global-error-handler.service';
import { CustomizedHttpErrorResponse } from '../models/customized-http-error-response';
import { LOCAL_STORAGE_KEYS } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
/**
 * This interceptor is meant to catch errors from backend that are meant to be displayed to users.
 * It cancels default snackbar error messages defined on frontend, but it doesnt stop error handlers, it just effects
 * the snackbar messages. Instead of these messages it shows the message from backend.
 */
export class GlobalHttpErrorInterceptorService implements HttpInterceptor {

  constructor(public authenticationService: AuthenticationService,
    public globalErrorHandler: GlobalErrorHandlerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req)
      .pipe(
        catchError((error: CustomizedHttpErrorResponse) => {

          const isUserAuthenticated = Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken));

          // Must check in order to avoid error: "Cannot read property 'friendlyMessage' of null"
          if (error.error) {
            // Custom field on error object, made by backend developer for specific cases:
            const userFriendlyMessageFromBackend = error.error.friendlyMessage;
            if (userFriendlyMessageFromBackend) {
              this.showMessage(userFriendlyMessageFromBackend, error)
            }
          }

          let errorMessage: string;

          switch (error.status) {
            case 401:

              errorMessage = 'You are not authorized to access this resource!'
              this.showMessage(errorMessage, error)

              if (isUserAuthenticated) {
                this.authenticationService.logout()
              }

              break;

            case 403:

              errorMessage = 'You are not authorized for this action!'
              this.showMessage(errorMessage, error)

              break;

            default:
              break;
          }

          return throwError(error);
        })

      )

  }

  showMessage(errorMessage: string, error: CustomizedHttpErrorResponse) {
    this.globalErrorHandler.handleHttpError(error, errorMessage)
  }

}

