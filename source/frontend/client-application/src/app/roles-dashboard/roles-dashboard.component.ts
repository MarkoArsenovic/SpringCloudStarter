import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../shared/services/dialog.service';
import { MaterialTableService } from '../shared/services/material-table.service';
import { RolesService } from '../services/roles.service';
import { RolesFormComponent } from '../roles-form/roles-form.component';
import { Role } from '../shared/models/role';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { IAM_SERVICES_DATA, PERMISSION_STRINGS } from '../shared/utils/const';

@Component({
  selector: 'app-roles-dashboard',
  templateUrl: './roles-dashboard.component.html',
  styleUrls: ['../shared/styles/dashboard.scss', './roles-dashboard.component.scss']
})
export class RolesDashboardComponent implements AfterViewInit {

  serviceName: string = IAM_SERVICES_DATA.iam.name;
  permissionStrings = PERMISSION_STRINGS;

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<Role>;
  tableDefaultFilterInput: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogService: DialogService, public rolesService: RolesService, public tableService: MaterialTableService,
    private globalErrorHandler: GlobalErrorHandlerService, private snackbarService: SnackbarService) { }

  ngAfterViewInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.rolesService.getAllRoles().subscribe((roles: Role[]) => {
      this.dataSource = this.tableService.insertDataIntoTable(roles, this.paginator, this.sort);
    }, (err: CustomizedHttpErrorResponse) => {
      const errorMessage = 'Cannot get roles!'
      this.globalErrorHandler.handleHttpError(err, errorMessage)
    })
  }

  openCreationForm() {
    const dialogRef = this.dialogService.open(RolesFormComponent)

    dialogRef.componentInstance.formOutput
      .subscribe((role: Role) => {
        this.rolesService.createRole(role).subscribe(() => {

          dialogRef.close()

          const message = "Role successfully created!"
          this.snackbarService.open(message)

          this.getAllRoles()

        }, (err: CustomizedHttpErrorResponse) => {

          this.globalErrorHandler.handleHttpError(err)

        })

      })
  }

  editRole(role: Role) {
    this.rolesService.getRoleById(role.id).subscribe(role => {
      const dialogRef = this.dialogService.open(RolesFormComponent, {
        data: { passedRole: role }
      })

      dialogRef.componentInstance.formOutput
        .subscribe((editedRole: Role) => {

          this.rolesService.updateRole(editedRole).subscribe(() => {

            dialogRef.close()

            const message = "Role successfully updated!"
            this.snackbarService.open(message)

            this.getAllRoles()

          }, (err: CustomizedHttpErrorResponse) => {
            this.globalErrorHandler.handleHttpError(err)

          })

        })

    }, (err: CustomizedHttpErrorResponse) => {
      const message = 'Cannot get role!';
      this.globalErrorHandler.handleHttpError(err)
    })
  }

  removeRole(role: Role) {
    this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: false,
      data: {
        message: `Are you sure you want to remove role ${role.name}?`
      }
    }, false).afterClosed().subscribe(res => {
      if (res) {

        this.rolesService.removeRole(role.id).subscribe(() => {

          this.getAllRoles();

          const message = "Role successfully removed!";
          this.snackbarService.open(message)

        }, (err: CustomizedHttpErrorResponse) => {
          this.globalErrorHandler.handleHttpError(err)
        })

      }
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

}
