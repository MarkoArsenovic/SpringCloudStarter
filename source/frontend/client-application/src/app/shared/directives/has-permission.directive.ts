import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { LOCAL_STORAGE_KEYS, PERMISSION_STRINGS } from '../utils/const';

/**
 * This directive is done based on this tutorial: https://juristr.com/blog/2018/02/angular-permission-directive/#basically-we-need-an-ngif-right
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private currentUserPermissions;
  private permissions = [];
  // logicalOp represents the logical operation for permissions provided in template. AND means user has to have all the provided permissions to see the element,
  // and OR means he needs to have at least one of the permissions to see the element.
  private logicalOp = 'AND';
  // isHidden helps us keep track of whether we’ve already added the template into the DOM. 
  // We don’t want to add it multiple times in case when the permissions update and evaluate to true.
  private isHidden = true;

  private permissionStrings = PERMISSION_STRINGS;
  private permissionStringsKeys: Array<string> = Object.keys(this.permissionStrings)

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    // When user is logged in, and page gets refreshed, I get the permissions info from the browser storage
    this.currentUserPermissions = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userPermissions));
    this.updateView();

    // Whenever a new user logs into the app, view gets updated based on his permissions
    this.authenticationService.currentUserPermissions$.subscribe(user => {
      // A way in ES 5+ to check if object is emtpy (https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object)
      const noUser = Object.keys(user).length === 0 && user.constructor === Object;
      if (!noUser) {
        this.currentUserPermissions = user;
        this.updateView();

      }
    });
  }

  // We get the list of permissions through this input from the template
  @Input()
  set hasPermission(val) {
    this.permissions = val;
    this.updateView();
  }

  // We get the logical operation from the template ('op' operation from the template)
  @Input()
  set hasPermissionOp(permop) {
    this.logicalOp = permop;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      // isHidden helps us keep track of whether we’ve already added the template into the DOM. 
      // We don’t want to add it multiple times in case when the permissions update and evaluate to true.
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    let hasPermission = false;

    if (this.currentUserPermissions && this.currentUserPermissions.permissions) {

      switch (this.logicalOp) {

        // User has to have all permissions provided inside directive
        case 'AND':

          hasPermission = true;

          for (const checkPermission of this.permissions) {
            const permissionFound = this.currentUserPermissions.permissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());

            if (!permissionFound) {
              hasPermission = false;
              break;
            }

          }

          break;

        // User has to have at least one permission provided inside directive
        case 'OR':

          hasPermission = false;

          for (const checkPermission of this.permissions) {
            const permissionFound = this.currentUserPermissions.permissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());

            if (permissionFound) {
              hasPermission = true;
              break;
            }

          }

          break;

        // User has to have all permissions (create, read, update, delete) on all services provided inside directive.   
        case 'AND_ALL':

          hasPermission = true;

          for (const checkPermission of this.permissions) {
            let permissionExists = true;

            for (const permissionStringKey of this.permissionStringsKeys) {
              const permissionFound = this.currentUserPermissions.permissions.find(x => x.toUpperCase() === (checkPermission + this.permissionStrings[permissionStringKey]).toUpperCase());
              if (!permissionFound) {
                permissionExists = false;
                break;
              }
            }

            if (!permissionExists) {
              hasPermission = false;
              break;
            }

          }

          break;

        // User needs to have at least one permission (create, read, update, delete) on any of the services provided inside directive.   
        case 'OR_ALL':

          hasPermission = false;

          for (const checkPermission of this.permissions) {
            let permissionExists = false;

            for (const permissionStringKey of this.permissionStringsKeys) {
              const permissionFound = this.currentUserPermissions.permissions.find(x => x.toUpperCase() === (checkPermission + this.permissionStrings[permissionStringKey]).toUpperCase());
              if (permissionFound) {
                permissionExists = true;
                break;
              }
            }

            if (permissionExists) {
              hasPermission = true;
              break;
            }

          }

          break;

        default:
          break;
      }

    }

    return hasPermission;
  }
}
