import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Role } from '../shared/models/role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  BASE_URL = environment.BASE_URL;
  BACKEND_ROUTE_PREFIX = 'iam-service/role';
  URL_PREFIX = this.BASE_URL + this.BACKEND_ROUTE_PREFIX;

  constructor(private http: HttpClient) { }

  getAllRoles() {
    return this.http.get<Role[]>(this.URL_PREFIX + '/roles')
  }

  getRoleById(id: string) {
    return this.http.get<Role>(this.URL_PREFIX + '/roles/' + id)
  }

  createRole(role: Role) {
    return this.http.post(this.URL_PREFIX, {
      'name': role.name,
      'description': role.description
    });
  }

  updateRole(role: Role) {
    return this.http.put(this.URL_PREFIX, role);
  }

  removeRole(id: string) {
    return this.http.delete(this.URL_PREFIX + '/roles/' + id);
  }
}
