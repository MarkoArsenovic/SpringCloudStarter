import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_KEYS, PUBLIC_ROUTES, AUTHORIZATION_HEADER_KEY, CACHE_DISABLE_HEADERS } from '../utils/const';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const requestUrl = req.url;

    let isProtectedRoute: boolean = true;

    for (const publicRoute in PUBLIC_ROUTES) {
      if (PUBLIC_ROUTES.hasOwnProperty(publicRoute)) {
        if (requestUrl.includes(PUBLIC_ROUTES[publicRoute])) {
          isProtectedRoute = false;
          break;
        }
      }
    }

    // Authorization token is needed only on protected routes, not on public
    if (isProtectedRoute) {

      const loginToken: any = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken))

      const tokenizedReq = req.clone({
        setHeaders: {
          [AUTHORIZATION_HEADER_KEY]: loginToken.tokenType + ' ' + loginToken.accessToken,
          ...CACHE_DISABLE_HEADERS
        }
      })

      return next.handle(tokenizedReq)

    } else {

      return next.handle(req)

    }


  }

}
