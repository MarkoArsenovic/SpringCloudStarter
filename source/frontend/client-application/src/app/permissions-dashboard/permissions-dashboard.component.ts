import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Role } from '../shared/models/role';
import { Service } from '../shared/models/service';
import { Permission } from '../shared/models/permission';
import { Subscription, BehaviorSubject, Observable, Observer, forkJoin } from 'rxjs';
import { skip, finalize } from 'rxjs/operators';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { LOCAL_STORAGE_KEYS, IAM_SERVICES_DATA, PERMISSION_STRINGS } from '../shared/utils/const';
import { RolesService } from '../services/roles.service';
import { ServicesService } from '../services/services.service';
import { PermissionsService } from '../services/permissions.service';


@Component({
  selector: 'app-permissions-dashboard',
  templateUrl: './permissions-dashboard.component.html',
  styleUrls: ['../shared/styles/dashboard.scss', './permissions-dashboard.component.scss']
})
export class PermissionsDashboardComponent implements OnInit, OnDestroy {

  iamServiceName: string = IAM_SERVICES_DATA.iam.name;
  permissionStrings = PERMISSION_STRINGS;

  displayedColumns: string[] = ['name', 'create', 'read', 'update', 'delete', 'toggleRow'];
  dataSource: MatTableDataSource<Service>;
  createSelection = new SelectionModel<Service>(true, []);
  readSelection = new SelectionModel<Service>(true, []);
  updateSelection = new SelectionModel<Service>(true, []);
  deleteSelection = new SelectionModel<Service>(true, []);

  //Array for easier manipulation, when all selections need to be handled
  selectionArray: Array<SelectionModel<Service>> = []

  allRoles: Array<Role> = [];
  permissionsForSelectedRole: Array<Permission> = [];
  selectedRole: Role = null;

  //If is false, it doesnt show the table
  showPermissions: boolean = false;
  //Array for easier manipulation, when all subscriptions need to be handled
  permissionsChangeSubscriptions: Array<Subscription> = [];
  checkboxActiveRequestsSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  /**
   * Remaining subscriptions that need unsubscribing on component destroy, to prevent memory leaks
   */
  subscriptionsArray: Array<Subscription> = [];

  disableCheckboxFields: boolean = false;
  disableRolesDropdown: boolean = false;

  constructor(private rolesService: RolesService, private snackBarService: SnackbarService,
    private globalErrorHandler: GlobalErrorHandlerService, private servicesService: ServicesService, 
    private permissionsService: PermissionsService) { 
    const storagePermissionsObject = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userPermissions));

    if (storagePermissionsObject) {

      const userPermissions: Array<string> = storagePermissionsObject.permissions;

      const updatePermission = userPermissions.find(permission => permission === `${this.iamServiceName}${this.permissionStrings.canUpdate}`);

      if (!updatePermission) {
        this.disableCheckboxFields = true;
      }
    }

  }

  ngOnInit() {
    this.selectionArray.push(this.createSelection)
    this.selectionArray.push(this.readSelection)
    this.selectionArray.push(this.updateSelection)
    this.selectionArray.push(this.deleteSelection)
    
    this.getDashboardData();

    /**
     * When updating a permission a refresh of data is necessary, even in the case the request succeeds. Why?
     * There might be cases when user clicks fast on one checkbox 2+ times. Lets say he clicked fast 2 times on one checkbox.
     * In this case two requests for the same checkbox are sent to the backend. We cannot say for sure which one of them is
     * going to affect the database first. It can be the case (tested and verified) that first request gets
     * to the database after the second one. Without the page refreshing, the table would show the incorrect data to the user in this case.
     * Thats why page refresh is necessary, even when requests succeed. Offcourse it is necessary when request fails, because
     * again, without refresh, table would show the incorrect data to the user. 
     */
    const checkboxActiveRequestsSubscription = this.checkboxActiveRequestsSubject.pipe(
      /**
       * Skipping first because this is a behavior subject
       */
      skip(1)
    ).subscribe((activeRequestsNumber: number) => {

      this.disableRolesDropdown = true;

      /**
       * If all active requests are not first finished, state retrieved from
       * database will not be real, thats why this check is necessary!
       */
      if (activeRequestsNumber === 0) {
        this.getPermissionsByRoleName(this.selectedRole.name, false)
          .subscribe(
            () => {
              this.disableRolesDropdown = false;
            },
            () => {
              this.disableRolesDropdown = false;
            }
          )
      }
    })

    this.subscriptionsArray.push(checkboxActiveRequestsSubscription);

  }

  getDashboardData() {

    const getAllRolesRequest = this.rolesService.getAllRoles()

    const getAllServicesRequest = this.servicesService.getAllServices()

    forkJoin([getAllRolesRequest, getAllServicesRequest]).subscribe(([roles, services]) => {
      this.allRoles = roles
      this.dataSource = new MatTableDataSource<Service>(services)
    }, (err: CustomizedHttpErrorResponse) => {
      const errorMessage = 'Cannot get dashboard data!'
      this.globalErrorHandler.handleHttpError(err, errorMessage)
    })

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(selection) {
    const numSelected = selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(selection, row?: any): string {
    if (!row) {
      return `${this.isAllSelected(selection) ? 'select' : 'deselect'} all`;
    }
    return `${selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  toggleRow(row: any) {

    this.cancelPermissionsChangeSubscriptions()
    let editedPermission: Permission;

    if (this.isWholeRowSelected(row)) {
      this.selectionArray.forEach(element => {
        element.deselect(row)
      });

      editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === row.name && permission.service.id === row.id)
      editedPermission.canRead = false;
      editedPermission.canUpdate = false;
      editedPermission.canWrite = false;
      editedPermission.canDelete = false;
    } else {
      this.selectionArray.forEach(element => {
        element.select(row)
      });

      editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === row.name && permission.service.id === row.id)
      editedPermission.canRead = true;
      editedPermission.canUpdate = true;
      editedPermission.canWrite = true;
      editedPermission.canDelete = true;
    }

    this.updatePermission(editedPermission)


  }

  isWholeRowSelected(row: any) {

    let wholeRowSelected = true;

    this.selectionArray.forEach(element => {
      if (!element.isSelected(row)) {
        wholeRowSelected = false
      }
    });

    if (wholeRowSelected) {
      return true;
    } else {
      return false;
    }
  }
  
  /** If something in row is selected, but not all */
  isAnythingInRowSelected(row: any) {

    const isWholeRowSelected = this.isWholeRowSelected(row)
    let isAnythingInRowSelected = false

    this.selectionArray.forEach(element => {
      if (element.isSelected(row)) {
        isAnythingInRowSelected = true
      }
    });

    if (!isWholeRowSelected && isAnythingInRowSelected) {
      return true;
    } else {
      return false;
    }

  }

  onRoleSwitch(selectedRole: Role) {
    this.getPermissionsByRoleName(selectedRole.name).subscribe()
  }
  
  /** Subscribes to permission changes, so that requests can be sent immediately when chekcbox field is checked/unchecked */
  subcribeToPermissionsChanges() {

    //no need to subscribe if subscriptions already exist
    if (!this.permissionsChangeSubscriptions.length) {

      // All subscription need to be handled individually, cannot target specific subscription in array through foreach
      const createSelectionSubscription = this.createSelection.changed.subscribe(data => {
        const checkedField = data.added[0];
        const unCheckedField = data.removed[0];

        let editedPermission: Permission;

        if (checkedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === checkedField.name && permission.service.id === checkedField.id)
          editedPermission.canWrite = true;

        } else if (unCheckedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === unCheckedField.name && permission.service.id === unCheckedField.id)
          editedPermission.canWrite = false;
        }

        this.updatePermission(editedPermission)


      })

      this.permissionsChangeSubscriptions.push(createSelectionSubscription);


      const readSelectionSubscription = this.readSelection.changed.subscribe(data => {
        const checkedField = data.added[0];
        const unCheckedField = data.removed[0];

        let editedPermission: Permission;

        if (checkedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === checkedField.name && permission.service.id === checkedField.id)
          editedPermission.canRead = true;

        } else if (unCheckedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === unCheckedField.name && permission.service.id === unCheckedField.id)
          editedPermission.canRead = false;
        }

        this.updatePermission(editedPermission)


      })

      this.permissionsChangeSubscriptions.push(readSelectionSubscription);


      const updateSelectionSubscription = this.updateSelection.changed.subscribe(data => {
        const checkedField = data.added[0];
        const unCheckedField = data.removed[0];

        let editedPermission: Permission;

        if (checkedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === checkedField.name && permission.service.id === checkedField.id)
          editedPermission.canUpdate = true;

        } else if (unCheckedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === unCheckedField.name && permission.service.id === unCheckedField.id)
          editedPermission.canUpdate = false;
        }

        this.updatePermission(editedPermission)


      })

      this.permissionsChangeSubscriptions.push(updateSelectionSubscription);

      const deleteSelectionSubscription = this.deleteSelection.changed.subscribe(data => {
        const checkedField = data.added[0];
        const unCheckedField = data.removed[0];

        let editedPermission: Permission;

        if (checkedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === checkedField.name && permission.service.id === checkedField.id)
          editedPermission.canDelete = true;

        } else if (unCheckedField) {
          editedPermission = this.permissionsForSelectedRole.find(permission => permission.service.name === unCheckedField.name && permission.service.id === unCheckedField.id)
          editedPermission.canDelete = false;
        }

        this.updatePermission(editedPermission)


      })

      this.permissionsChangeSubscriptions.push(deleteSelectionSubscription);
    }

  }


  /**
   * Subscription for permission changes must be sometimes canceled, for instance when checkbox fields are being populated when different role is being
   * selected. If subscriptions are active at this time, it will send PUT requests for permission change.
   */
  cancelPermissionsChangeSubscriptions() {
    this.permissionsChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe()
    });
    this.permissionsChangeSubscriptions = [];
  }

  updatePermission(editedPermission: Permission) {
    /**
     * If previous refresh is active, it must be canceled, because it can override
     * the new state that user has entered by clicking on some checkbox(es). 
     * 
     * Despite that this cancelation exists on get permission requests inside the service, it is still needed
     * here, because here it is canceled as soon the user clicks some checkbox, so cancelation doesnt
     * need to wait for update permission request to finish (cancelation in service would need to wait for this)
     */
    this.permissionsService.cancelPendingUpdateStateRequestsPermissions.next();

    let currentActiveRequests: number = this.checkboxActiveRequestsSubject.value;
    this.checkboxActiveRequestsSubject.next(++currentActiveRequests);

    this.permissionsService.updatePermission(editedPermission)
    .pipe(
      finalize(() => {
        let currentActiveRequests: number = this.checkboxActiveRequestsSubject.value;
        this.checkboxActiveRequestsSubject.next(--currentActiveRequests);
      })
    )
    .subscribe(() => {
    
      /**
       * If there are multiple checkbox requests active at the same time,
       * it is not good to refresh the data after each request succeds. Why? Imagine the case where, for instance, 
       * 3 differnt checkboxes are checked very quickly and their requests are active at the same time.
       * If the data gets refreshed in the moment when the first request succeds, and the other two requests are still pending,
       * refresh would show the user first checkbox checked, AND TWO OTHER CHECKBOXES UNCHECKED, EVEN IF USER HAS CHECKED THEM.
       * That is why refresh needs to be performed at the end, when all requests succeed.
       * 
       * Also for the same reason, if there is a pending refresh activated by some
       * previous request, it should be canceled (doing at the begining of this method)
       */

    }, (err: CustomizedHttpErrorResponse) => {

      /**
       * On the data refresh performed by checkboxActiveRequestsSubject,
       * this flag will be set again to true
       */
      this.showPermissions = false;

      const errorMessage = 'Permission update failed!';
      this.globalErrorHandler.handleHttpError(err, errorMessage);

    })

  } 


  populateCheckboxesForSelectedPermission() {

    this.cancelPermissionsChangeSubscriptions()
    
    //First clear all the checkboxes
    this.selectionArray.forEach(selection => {
      selection.clear();
    });

    this.permissionsForSelectedRole.forEach(permission => {
      const serviceInTable = this.dataSource.data.find(service => service.name === permission.service.name && service.id === permission.service.id)
      
      if (permission.canDelete === true) {
        this.deleteSelection.select(serviceInTable)
      }

      if (permission.canRead === true) {
        this.readSelection.select(serviceInTable)
      }

      if (permission.canUpdate === true) {
        this.updateSelection.select(serviceInTable)
      }

      if (permission.canWrite === true) {
        this.createSelection.select(serviceInTable)
      }

    });
  }

  getPermissionsByRoleName(selectedRoleName: string, initialTableHide: boolean = true) {

    return new Observable((o: Observer<any>) => {
      if (initialTableHide) {
        this.showPermissions = false;
      }

      this.permissionsService.getPermissionsByRoleName(selectedRoleName)
        .pipe(
          finalize(() => {
            /**
             * In case of request cancelation, all subscribers will be unsubscribed
             */
            o.complete();
          })
        )
        .subscribe((retreivedPermissions: Array<Permission>) => {

          /** If there is role selected in dropdown and if table data is retrieved */
          if (this.selectedRole && this.dataSource) {
            /** Show permissions only if they match the selected role in dropdown */
            if (selectedRoleName === this.selectedRole.name) {
              this.showPermissions = true;
              this.permissionsForSelectedRole = retreivedPermissions;

              this.populateCheckboxesForSelectedPermission();
              this.subcribeToPermissionsChanges();
            }
            /** If they dont match, reload permissions */
            else {
              this.getPermissionsByRoleName(this.selectedRole.name).subscribe();
            }
          } else {
            /**
             * This is the only case that should be handled with a user message
             */
            if (!this.dataSource && this.selectedRole) {
              const message = "Cannot show permissions, services not retrieved!";
              this.snackBarService.open(message);
            }
          }

          o.next(retreivedPermissions);
          o.complete();
        }, (err: CustomizedHttpErrorResponse) => {
          this.showPermissions = false;

          const errorMessage = 'Cannot get permissions for selected role!';
          this.globalErrorHandler.handleHttpError(err, errorMessage);

          o.error(err);
        })

    });

  }

  ngOnDestroy() {
    this.permissionsChangeSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.subscriptionsArray.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}

