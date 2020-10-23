import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidatorsService, ConfirmPasswordErrorMatcher } from '../shared/services/custom-validators.service';
import { ResetPassword } from '../shared/models/reset-password';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../shared/styles/public-route-form.scss', './reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  id: string
  token: string

  resetPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(8), this.customValidatorsService.trimWhiteSpaceValidator()]],
    confirmPassword: ['', [Validators.required, this.customValidatorsService.trimWhiteSpaceValidator()]]
  }, { validators: this.customValidatorsService.confirmPasswordValidator() });

  errorMatcher = new ConfirmPasswordErrorMatcher();

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private globalErrorHandler: GlobalErrorHandlerService,
    private snackbarService: SnackbarService, private router: Router, private route: ActivatedRoute, private customValidatorsService: CustomValidatorsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.token = params.get('token')
    });
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const password = this.f.password.value
      const confirmPassword = this.f.confirmPassword.value
      const resetPasswordObject = new ResetPassword(password, confirmPassword)

      this.auth.resetPassword(resetPasswordObject, this.id, this.token).subscribe(() => {
        const message = 'Password reset successful!'
        this.snackbarService.open(message)
        this.router.navigateByUrl('/login')
      }, (err: CustomizedHttpErrorResponse) => {
        this.globalErrorHandler.handleHttpError(err)
      });
    }
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

}
