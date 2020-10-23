import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../shared/services/snackbar.service';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CustomValidatorsService } from '../shared/services/custom-validators.service';
import { FormService } from '../shared/services/form.service';
import { UserProfileService } from '../services/user-profile.service';
import { User } from '../shared/models/user';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['../shared/styles/form-in-dialog.scss', './user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {

  form: FormGroup
  originalUserObject: User

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserProfileFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBarService: SnackbarService,
    private globalErrorHandler: GlobalErrorHandlerService, private customValidatorsService: CustomValidatorsService, private profileService: UserProfileService, 
    public formService: FormService) {

    this.originalUserObject = data.user

    this.form = this.fb.group({
      name: [data.user.name, [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
      lastname: [data.user.lastname, [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
      username: [data.user.username, [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
      email: [data.user.email, [Validators.required, Validators.maxLength(70), Validators.email, this.customValidatorsService.trimWhiteSpaceValidator()]]
    });

  }

  ngOnInit(): void {
  }

  updateProfile() {
    if(!this.formService.checkFormValidity(this.form)) {
      return;
    }

    const editedProfile: User = { ...this.originalUserObject, ...this.form.value }

    this.profileService.updateProfile(editedProfile).subscribe(() => {

      const message = "Profile successfully updated!"
      this.snackBarService.open(message)

      this.dialogRef.close(true)

    }, (err: CustomizedHttpErrorResponse) => {
      this.globalErrorHandler.handleHttpError(err)
    })
  }

  get f() {
    return this.form.controls;
  }

}
