import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE_KEYS } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkIfUserIsGuest();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkIfUserIsGuest();
  }

  /**
   * User is a guest if he is not authenticated.
   */
  checkIfUserIsGuest(): boolean {
    const isUserAuthenticated = Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken));
    if (isUserAuthenticated)
      this.router.navigateByUrl('/home');
    return (isUserAuthenticated ? false : true);
  }

}
