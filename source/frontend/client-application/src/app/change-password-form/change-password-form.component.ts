import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../shared/services/custom-validators.service';
import { FormService } from '../shared/services/form.service';
import { UserProfileService } from '../services/user-profile.service';
import { ChangePassword } from '../shared/change-password';
import { SnackbarService } from '../shared/services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['../shared/styles/form-in-dialog.scss', './change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {

  form = this.fb.group({
    oldPassword: ['', [Validators.required, this.customValidatorsService.trimWhiteSpaceValidator()]],
    newPasswords: this.fb.group({
      password: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(8), this.customValidatorsService.trimWhiteSpaceValidator()]],
      confirmPassword: ['', [Validators.required, this.customValidatorsService.trimWhiteSpaceValidator()]]
    }, { validators: this.customValidatorsService.confirmPasswordValidator() })
  });

  constructor(private fb: FormBuilder, private customValidatorsService: CustomValidatorsService, 
    public formService: FormService, private profileService: UserProfileService, private snakcbarService: SnackbarService, 
    private dialogRef: MatDialogRef<ChangePasswordFormComponent>, private globalErrorHandler: GlobalErrorHandlerService) { }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls as any;
  }

  changePassword() {
    if(!this.formService.checkFormValidity(this.form)) {
      return;
    }

    const oldPassword = this.form.value.oldPassword;
    const newPassword = this.form.value.newPasswords.password;
    const confirmNewPassword = this.form.value.newPasswords.confirmPassword;

    const changePasswordObj: ChangePassword = new ChangePassword(oldPassword, newPassword, confirmNewPassword);

    this.profileService.changeUserPassword(changePasswordObj).subscribe(() => {

      const message = "Password successfully changed!"
      this.snakcbarService.open(message)

      this.dialogRef.close(true)

    }, (err: CustomizedHttpErrorResponse) => {
      this.globalErrorHandler.handleHttpError(err)
    })
    
  }

}
