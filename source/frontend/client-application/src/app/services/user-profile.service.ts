import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { ChangePassword } from '../shared/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  BASE_URL = environment.BASE_URL;
  BACKEND_ROUTE_PREFIX = 'iam-service/user/account/';
  URL_PREFIX = this.BASE_URL + this.BACKEND_ROUTE_PREFIX;

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<User>(this.URL_PREFIX + 'details');
  }

  updateProfile(user: User) {
    return this.http.put(this.URL_PREFIX + 'edit', user);
  }

  changeUserPassword(passwords: ChangePassword) {
    return this.http.put(this.URL_PREFIX + 'change-password', passwords);
  }
}
