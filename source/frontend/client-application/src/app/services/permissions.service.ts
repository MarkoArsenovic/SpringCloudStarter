import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { takeUntil, map } from 'rxjs/operators';
import { Permission } from '../shared/models/permission';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  BASE_URL = environment.BASE_URL
  BACKEND_ROUTE_PREFIX = 'iam-service/permission'
  URL_PREFIX = this.BASE_URL + this.BACKEND_ROUTE_PREFIX

  cancelPendingUpdateStateRequestsPermissions = new Subject<void>()

  constructor(private http: HttpClient) { }

  getPermissionsByRoleName(roleName: string) {
    this.cancelPendingUpdateStateRequestsPermissions.next();

    return this.http.get(this.URL_PREFIX + '/role/' + roleName + '/permissions')
      .pipe(
        takeUntil(this.cancelPendingUpdateStateRequestsPermissions),
        map((retreivedPermissions: any) => {

          const mappedPermissions = [];
          retreivedPermissions.forEach(permission => {
            mappedPermissions.push(new Permission(permission.id, permission.canDelete, permission.canRead, permission.canUpdate,
              permission.canWrite, permission.role, permission.service))
          });

          return mappedPermissions;
        })
      );
  }

  updatePermission(permission: Permission) {
    return this.http.put(this.URL_PREFIX, permission);
  }

}
