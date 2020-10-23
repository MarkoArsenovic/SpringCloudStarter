import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginData } from '../models/login-data';
import { tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { LOCAL_STORAGE_KEYS, PERMISSION_STRINGS } from '../utils/const';
import { UserRegister } from '../models/user-register';
import { ResetPassword } from '../models/reset-password';
import { UserInfo } from '../models/user-info';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  BASE_URL = environment.BASE_URL;
  BACKEND_PATH = 'iam-service/user/';
  permissionStrings = PERMISSION_STRINGS;

  private currentUserPermissionsSubject = new BehaviorSubject<any>({});
  public currentUserPermissions$ = this.currentUserPermissionsSubject.asObservable().pipe(distinctUntilChanged());
  
  constructor(private http: HttpClient, private router: Router) { }

  register(user: UserRegister) {
    return this.http.post(this.BASE_URL + this.BACKEND_PATH + 'register', user)
  }

  login(loginData: LoginData) {
    return this.http.post(this.BASE_URL + this.BACKEND_PATH + 'login', loginData).pipe(
      tap((loginToken: any) => {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.loginToken, JSON.stringify(loginToken));
      }),
      switchMap(() => {
        return this.getUserInfo()
          .pipe(
            tap((userInfo: UserInfo) => {
             
              const retrievedPermissions = userInfo.permissions;

              const permissionsArray = []

              retrievedPermissions.forEach(permissionObject => {
                permissionObject.canDelete ? permissionsArray.push(permissionObject.serviceName + this.permissionStrings.canDelete) : null,
                  permissionObject.canRead ? permissionsArray.push(permissionObject.serviceName + this.permissionStrings.canRead) : null,
                  permissionObject.canUpdate ? permissionsArray.push(permissionObject.serviceName + this.permissionStrings.canUpdate) : null,
                  permissionObject.canWrite ? permissionsArray.push(permissionObject.serviceName + this.permissionStrings.canWrite) : null
              });

              const userPermissionsObject = {};
              userPermissionsObject['permissions'] = permissionsArray;
              window.localStorage.setItem(LOCAL_STORAGE_KEYS.userPermissions, JSON.stringify(userPermissionsObject))
              this.currentUserPermissionsSubject.next(userPermissionsObject);

              window.localStorage.setItem(LOCAL_STORAGE_KEYS.userInfo, JSON.stringify(userInfo))
              
              this.router.navigateByUrl('/home');
            })
          )
      })
    )
  }

  getUserInfo() {
    return this.http.get<UserInfo>(this.BASE_URL + this.BACKEND_PATH + 'info');
  }

  refreshLoginToken() {
    return this.http.post(this.BASE_URL + this.BACKEND_PATH + 'refresh-token', {})
      .pipe(tap((newToken: any) => {
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.loginToken, JSON.stringify(newToken));
      }));
  }

  forgotPasswordSendEmail(email: string) {
    return this.http.post(this.BASE_URL + this.BACKEND_PATH + 'forgot-password', {
      'email': email
    });
  }

  resetPassword(resetPasswordObject: ResetPassword, id: string, token: string) {
    return this.http.post(this.BASE_URL + this.BACKEND_PATH + `reset-password?id=${id}&token=${token}`, resetPasswordObject);
  }

  logout() {
    /**
     * All pending http requests get canceled on logout, done by answer from Bladito from this link
     * https://stackoverflow.com/questions/46068908/how-to-cancel-unsubscribe-all-pending-http-requests-angular-4
     */
    // this.httpCancelService.cancelPendingRequests()
    window.localStorage.clear()
    this.router.navigateByUrl('/login')
  }

}
