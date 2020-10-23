import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../utils/const';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router
  ) {
  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfUserIsAuthenticated();
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfUserIsAuthenticated();
  }

  checkIfUserIsAuthenticated(): boolean {
    const isUserAuthenticated = Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken));
    if (!isUserAuthenticated)
      this.router.navigateByUrl('/login');
    return (isUserAuthenticated ? true : false);
  }
  
}
