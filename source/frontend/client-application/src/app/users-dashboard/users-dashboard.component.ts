import { Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from '../services/users.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { Subscription, forkJoin, throwError } from 'rxjs';
import { User } from '../shared/models/user';
import { Role } from '../shared/models/role';
import { UpdateUserRolesObj } from '../shared/models/update-user-roles-obj';
import { catchError } from 'rxjs/operators';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { LOCAL_STORAGE_KEYS, IAM_SERVICES_DATA, PERMISSION_STRINGS } from '../shared/utils/const';
import { MaterialTableService } from '../shared/services/material-table.service';
import { UpdateUserRolesFormComponent } from '../update-user-roles-form/update-user-roles-form.component';
import { RolesService } from '../services/roles.service';
import { DialogService } from '../shared/services/dialog.service';


export class DisplayedUser extends User {
  constructor(
    user: User,
    public displayedRoles: string
  ) {
    super(
      user.id,
      user.username,
      user.name,
      user.lastname,
      user.email,
      user.userRoles
    )
  }
}

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['../shared/styles/dashboard.scss', './users-dashboard.component.scss']
})
export class UsersDashboardComponent implements AfterViewInit, OnDestroy {

  serviceName: string = IAM_SERVICES_DATA.iam.name;
  permissionStrings = PERMISSION_STRINGS;

  displayedColumns: string[];
  dataSource: MatTableDataSource<DisplayedUser>;
  dataReceiveSubscription: Subscription
  allRoles: Array<Role> = [];
  tableDefaultFilterInput: string;
  selectedRole: Role = null;
  users: Array<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogService: DialogService, private snackbarService: SnackbarService, public tableService: MaterialTableService,
    private globalErrorHandler: GlobalErrorHandlerService, private usersService: UsersService, private rolesService: RolesService) {
    const storagePermissionsObject = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userPermissions));

    if (storagePermissionsObject) {
      const userPermissions: Array<string> = storagePermissionsObject.permissions;

      const updatePermission = userPermissions.find(permission => permission === `${this.serviceName}${this.permissionStrings.canUpdate}`);
      const deletePermission = userPermissions.find(permission => permission === `${this.serviceName}${this.permissionStrings.canDelete}`);

      if (updatePermission || deletePermission) {
        this.displayedColumns = ['name', 'lastname', 'username', 'email', 'displayedRoles', 'operations'];
      } else {
        this.displayedColumns = ['name', 'lastname', 'username', 'email', 'displayedRoles'];
      }

    }
  }

  ngOnInit() {

    // this.dataReceiveSubscription = this.accessManagementService.usersDataChanges$.subscribe(
    //   updatedTableData => {

    //     this.dataSource = new MatTableDataSource(updatedTableData);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;

    //     this.reapplyClientFilters()

    //   }
    // )

    // const getAllUsersRequest = this.accessManagementService.getUsersBasedOnLoggedUserPermissions(true).pipe(catchError(err => {
    //   return throwError(err);
    // }))

    // const getAllRolesRequest = this.accessManagementService.getRolesBasedOnLoggedUserPermissions().pipe(catchError(err => {
    //   return throwError(err);
    // }))

    // forkJoin([getAllUsersRequest, getAllRolesRequest]).subscribe(results => {
    //   const allRoles = results[1];
    //   this.allRoles = allRoles;
    // }, (err: CustomizedHttpErrorResponse) => {
    //   const errorMessage = 'Cannot get users data!';
    //   this.globalErrorHandler.handleHttpError(err, errorMessage)
    // })

    // this.sendPageTopInfoData();
  }

  ngAfterViewInit(): void {
    this.getAllUsers();
  }

  // openFormDialog(event) {
  //   event.stopPropagation()
  //   this.accessManagementService.getRolesBasedOnLoggedUserPermissions().subscribe((allRoles) => {
  //     this.dialog.open(UsersManagementFormComponent, {
  //       width: '600px',
  //       maxWidth: '95vw',
  //       panelClass: 'panonit-form-dialog-wrapper',
  //       maxHeight: '100vh',
  //       autoFocus: false,
  //       data: { passedRoles: allRoles }
  //     }).afterClosed().subscribe(res => {
  //       if (res) {
  //         this.retrieveAllData();
  //       }
  //     })
  //   }, (err: CustomizedHttpErrorResponse) => {
  //     const errorMessage = 'Cannot get roles!';
  //     this.globalErrorHandler.handleHttpError(err, errorMessage)
  //   })

  // }

  // openChangePasswordModal(event, user: User) {
  //   event.stopPropagation()
  //   this.dialog.open(ChangePasswordFormComponent, {
  //     width: '600px',
  //     maxWidth: '95vw',
  //     panelClass: 'panonit-form-dialog-wrapper',
  //     maxHeight: '100vh',
  //     data: { passedUser: user },
  //     autoFocus: false
  //   })
  // }

  // showUserDetails(event, user: User) {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const formattedUserRoles = []

  //   user.userRoles.forEach(role => {
  //     formattedUserRoles.push(role.name)
  //   });

  //   const formattedUserObject: any = Object.assign({}, user);

  //   formattedUserObject.userRoles = formattedUserRoles;

  //   const beautifiedUserData: any = this.accessManagementService.beautifyUserDetailsData(formattedUserObject);
  //   const treeObject = new TreeDataObject(beautifiedUserData);

  //   const entityObject = new DetailsModalObject(formattedUserObject, `${user.name} ${user.lastname}`, treeObject);

  //   this.dialog.open(DetailsReusableComponent, {
  //     width: '600px',
  //     maxWidth: '95vw',
  //     panelClass: 'panonit-form-dialog-wrapper',
  //     maxHeight: '100vh',
  //     data: { passedObject: entityObject },
  //     autoFocus: false
  //   })
  // }

  editUser(event, user: DisplayedUser) {
    event.stopPropagation()

    let errorMessage = '';

    const getUserByIdRequest = this.usersService.getUserById(user.id).pipe(catchError(err => {
      errorMessage += 'Cannot get user! '
      return throwError(err);
    }))

    const getAllRolesRequest = this.rolesService.getAllRoles().pipe(catchError(err => {
      errorMessage += 'Cannot get roles! '
      return throwError(err);
    }))

    forkJoin([getUserByIdRequest, getAllRolesRequest]).subscribe(results => {

      const user: User = results[0];
      const allRoles: Role[] = results[1];

      const updateObj = new UpdateUserRolesObj(user.id, user.userRoles);

      this.dialogService.open(UpdateUserRolesFormComponent, {
        autoFocus: false,
        data: { updateObj, allRoles }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.getAllUsers();
        }
      })

    }, (err: CustomizedHttpErrorResponse) => {
      this.globalErrorHandler.handleHttpError(err, errorMessage)
    })

  }


  removeUser(event, user: DisplayedUser) {
    event.stopPropagation()

    this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: false,
      data: {
        message: `Are you sure you want to remove user ${user.name} ${user.lastname}?`
      }
    }, false).afterClosed().subscribe(res => {
      if (res) {

        this.usersService.removeUser(user.id).subscribe(() => {

          this.getAllUsers();

          const message = "User successfully removed!";
          this.snackbarService.open(message)

        }, (err: CustomizedHttpErrorResponse) => {
          this.globalErrorHandler.handleHttpError(err)
        })

      }
    })

  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((users: User[]) => {
      const displayedUsers = this.mapToDisplayedUsers(users);
      this.dataSource = this.tableService.insertDataIntoTable(displayedUsers, this.paginator, this.sort)
    }, (err: CustomizedHttpErrorResponse) => {
      const errorMessage = 'Cannot get users!'
      this.globalErrorHandler.handleHttpError(err, errorMessage)
    })
  }

  defaultFilter(filterValue: string) {
    if (this.dataSource)
      this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearDefaultFilter() {
    if (this.dataSource) {
      this.dataSource.filter = null;
    }
    this.tableDefaultFilterInput = null;

    if (this.dataSource && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // retrieveAllData() {

  //   const activeServerFilters = this.filters.serverFilters.filter(filter => filter.filterValueGetter() !== null);

  //   if (activeServerFilters.length > 0) {
  //     /**
  //      * In the future, when there will be probably more than one server filter,
  //      * filter terms would be probably all collected and passed to one method which should by my opinion
  //      * be handled by backend (One sql query with all provided filter terms - probably most simple solution).
  //      */
  //     activeServerFilters.forEach(filter => {

  //       const filterValue = filter.filterValueGetter();
  //       filter.applyMethod(filterValue);

  //     });

  //   } else {
  //     this.accessManagementService.getUsersBasedOnLoggedUserPermissions(false).subscribe(() => {

  //       this.reapplyClientFilters();

  //     }, (err: CustomizedHttpErrorResponse) => {

  //       const errorMessage = 'Cannot get users!';
  //       this.globalErrorHandler.handleHttpError(err, errorMessage)

  //     })
  //   }


  // }

  mapToDisplayedUsers(users: User[]): DisplayedUser[] {
    const displayedUsers: DisplayedUser[] = [];

    users.forEach(user => {
      const displayedRoles = this.getRolesDisplayFormat(user.userRoles);
      const displayedUser = new DisplayedUser(user, displayedRoles);

      displayedUsers.push(displayedUser);
    });

    return displayedUsers;
  }

  getRolesDisplayFormat(roles: Array<Role>): string {

    const helperArray: Array<string> = []

    roles.forEach(role => {
      helperArray.push(role.name);
    });

    const generatedString = helperArray.join(', ');

    return generatedString;
  }


  ngOnDestroy() {
    // // prevent memory leak when component destroyed
    // this.dataReceiveSubscription.unsubscribe();
    // this.accessManagementService.resetUsersState();
    // //clean up info from page top component
    // this.pageTopInfoService.pageTopInfoCounter.next(null);
  }

}

