import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user';
import { UpdateUserRolesObj } from '../shared/models/update-user-roles-obj';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  BASE_URL = environment.BASE_URL;
  BACKEND_ROUTE_PREFIX = 'iam-service/user/';
  URL_PREFIX = this.BASE_URL + this.BACKEND_ROUTE_PREFIX;

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<User[]>(this.URL_PREFIX + 'users')
  }

  getUserById(id: number) {
    return this.http.get<User>(this.URL_PREFIX + 'users/' + id)
  }

  updateUserRoles(updateObj: UpdateUserRolesObj) {
    return this.http.put(this.URL_PREFIX + 'update', updateObj)
  }

  removeUser(id: number) {
    return this.http.delete(this.URL_PREFIX + id)
  }

}
