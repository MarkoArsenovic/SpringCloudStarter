import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../shared/services/snackbar.service';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { UpdateUserRolesObj } from '../shared/models/update-user-roles-obj';
import { Role } from '../shared/models/role';
import { CustomValidatorsService } from '../shared/services/custom-validators.service';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';

@Component({
  selector: 'app-update-user-roles-form',
  templateUrl: './update-user-roles-form.component.html',
  styleUrls: ['../shared/styles/form-in-dialog.scss', './update-user-roles-form.component.scss']
})
export class UpdateUserRolesFormComponent implements OnInit {

  form = this.fb.group({
    roles: this.fb.array([], this.customValidatorsService.multiselectCheckboxesRequiredValidator())
  });

  userUpdateObj: UpdateUserRolesObj
  allRoles: Role[]

  constructor(public dialogRef: MatDialogRef<UpdateUserRolesFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private usersService: UsersService, public snackBarService: SnackbarService,
    public globalErrorHandler: GlobalErrorHandlerService, private fb: FormBuilder, private customValidatorsService: CustomValidatorsService) { }

  ngOnInit(): void {
    this.userUpdateObj = this.data.updateObj;
    this.allRoles = this.data.allRoles;

    this.generateCheckboxes();
  }

  get f() {
    return this.form.controls;
  }

  get rolesInForm() {
    return this.form.get('roles') as FormArray;
  }

  generateCheckboxes() {
    this.allRoles.forEach(el => {
      if (this.userUpdateObj.userRoles.find(role => role.id === el.id)) {
        this.rolesInForm.push(new FormControl(true));
      } else {
        this.rolesInForm.push(new FormControl(false));
      }
    });
  }

  generateUpdateObject() {
    const selectedRoles: Role[] = []

    for (let i = 0; i < this.allRoles.length; i++) {
      if (this.rolesInForm.value[i]) {
        selectedRoles.push(this.allRoles[i])
      }
    }

    const updateObj = new UpdateUserRolesObj(this.userUpdateObj.id, selectedRoles);
    return updateObj;
  }

  updateUser() {
    if (this.form.valid) {
      const updateObj = this.generateUpdateObject()

      this.usersService.updateUserRoles(updateObj).subscribe(() => {
        const message = 'User successfully updated!'
        this.snackBarService.open(message)
        this.dialogRef.close(true)
      }, (err: CustomizedHttpErrorResponse) => {
        this.globalErrorHandler.handleHttpError(err)
      })
    }
  }

}
