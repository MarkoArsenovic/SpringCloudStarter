import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IAM_SERVICES_DATA, LOCAL_STORAGE_KEYS } from '../utils/const';
import { AuthenticationService } from '../services/authentication.service';
import { SnackbarService } from '../services/snackbar.service';
import { IamServiceData } from '../interfaces/iam-service-data';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivateChild {

  servicesData = IAM_SERVICES_DATA;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    public snackBarService: SnackbarService) {
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const storagePermissionsObject = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userPermissions));
    const isUserAuthenticated = Boolean(window.localStorage.getItem(LOCAL_STORAGE_KEYS.loginToken));

    if (!storagePermissionsObject && isUserAuthenticated) {
      this.authenticationService.logout();
      return false;
    }

    const userPermissions: Array<string> = storagePermissionsObject.permissions;

    const requestedUrl = state.url;
    let relatedServiceName: string;

    for (const key in this.servicesData) {
      if (this.servicesData.hasOwnProperty(key)) {
        const value: IamServiceData = this.servicesData[key];

        if (value.relatedUrls && value.relatedUrls.find(url => url === requestedUrl)) {
          relatedServiceName = value.name;
          break;
        }

      }
    }

    let hasPermission = false;

    if (relatedServiceName) {
      for (const permission of userPermissions) {
        if (permission.includes(relatedServiceName)) {
          hasPermission = true;
          break;
        }
      }
    } else {
      /**
       * In order for permissions guard to be defined globally (which covers routes that are not protected by user permissions, ie
       * they dont have the related service that is responsible for them),
       * hasPermission must be here set to true, otherwise all routes that are not
       * protected by user permissions would be unavailable.
       */
      hasPermission = true;
    }

    if (!hasPermission) {

      const message = "You are not authorized for this action!";
      this.snackBarService.open(message);

      this.router.navigateByUrl('/home');

      return false;
    }

    return true;
  }

}
