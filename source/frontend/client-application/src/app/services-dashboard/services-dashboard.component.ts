import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Service } from '../shared/models/service';
import { ServicesFormComponent } from '../services-form/services-form.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { ServicesService } from '../services/services.service';
import { LOCAL_STORAGE_KEYS, IAM_SERVICES_DATA, PERMISSION_STRINGS } from '../shared/utils/const';
import { MaterialTableService } from '../shared/services/material-table.service';
import { DialogService } from '../shared/services/dialog.service';


@Component({
  selector: 'app-services-dashboard',
  templateUrl: './services-dashboard.component.html',
  styleUrls: ['../shared/styles/dashboard.scss', './services-dashboard.component.scss']
})
export class ServicesDashboardComponent implements AfterViewInit {

  iamServiceName: string = IAM_SERVICES_DATA.iam.name;
  permissionStrings = PERMISSION_STRINGS;

  displayedColumns: string[];
  dataSource: MatTableDataSource<Service>;
  tableDefaultFilterInput: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialogService: DialogService, private snackbarService: SnackbarService, private servicesService: ServicesService,
    private globalErrorHandler: GlobalErrorHandlerService, private tableService: MaterialTableService) {
    const storagePermissionsObject = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userPermissions));

    if (storagePermissionsObject) {
      const userPermissions: Array<string> = storagePermissionsObject.permissions;

      const updatePermission = userPermissions.find(permission => permission === `${this.iamServiceName}${this.permissionStrings.canUpdate}`);
      const deletePermission = userPermissions.find(permission => permission === `${this.iamServiceName}${this.permissionStrings.canDelete}`);

      if (updatePermission || deletePermission) {
        this.displayedColumns = ['displayName', 'description', 'actions'];
      } else {
        this.displayedColumns = ['displayName', 'description'];
      }

    }

  }

  ngAfterViewInit(): void {
    this.getAllServices()
  }

  getAllServices() {
    this.servicesService.getAllServices().subscribe((services: Service[]) => {
      this.dataSource = this.tableService.insertDataIntoTable(services, this.paginator, this.sort);
    }, (err: CustomizedHttpErrorResponse) => {
      const errorMessage = 'Cannot get services!'
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

  openCreationForm() {
    const dialogRef = this.dialogService.open(ServicesFormComponent)

    dialogRef.componentInstance.formOutput
      .subscribe((service: Service) => {
        this.servicesService.createService(service).subscribe(() => {

          dialogRef.close()

          const message = "Service successfully created!"
          this.snackbarService.open(message)

          this.getAllServices()

        }, (err: CustomizedHttpErrorResponse) => {

          this.globalErrorHandler.handleHttpError(err)

        })

      })
  }

  editService(service: Service) {
    this.servicesService.getServiceById(service.id).subscribe(service => {
      const dialogRef = this.dialogService.open(ServicesFormComponent, {
        data: { passedService: service }
      })

      dialogRef.componentInstance.formOutput
        .subscribe((editedService: Service) => {

          this.servicesService.updateService(editedService).subscribe(() => {

            dialogRef.close()

            const message = "Service successfully updated!"
            this.snackbarService.open(message)

            this.getAllServices()

          }, (err: CustomizedHttpErrorResponse) => {
            this.globalErrorHandler.handleHttpError(err)

          })

        })

    }, (err: CustomizedHttpErrorResponse) => {
      this.globalErrorHandler.handleHttpError(err)
    })
  }


  removeService(service: Service) {

    this.dialogService.open(ConfirmDialogComponent, {
      autoFocus: false,
      data: {
        message: `CAUTION! If you remove ${service.name} service, permissions on pages that belong to it will no longer work properly! Are
      you sure you want to remove it?` }
    }).afterClosed().subscribe(res => {
      if (res) {

        this.servicesService.removeService(service.id).subscribe(() => {

          this.getAllServices();

          const message = "Service successfully removed!";
          this.snackbarService.open(message)

        }, (err: CustomizedHttpErrorResponse) => {
          this.globalErrorHandler.handleHttpError(err)
        })

      }
    })

  }

}

