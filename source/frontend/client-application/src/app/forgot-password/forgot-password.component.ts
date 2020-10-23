import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../shared/services/custom-validators.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../shared/styles/public-route-form.scss', './forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, this.customValidatorsService.trimWhiteSpaceValidator()]]
  });

  constructor(private fb: FormBuilder, private customValidatorsService: CustomValidatorsService,
    private auth: AuthenticationService, private snakcbarService: SnackbarService, private globalErrorHandler: GlobalErrorHandlerService) { }

  ngOnInit(): void {
  }

  sendEmail() {
    if (this.forgotPasswordForm.valid) {
      const email: string = this.f.email.value;

      this.auth.forgotPasswordSendEmail(email).subscribe(() => {
        const message = 'Email successfully sent!'
        this.snakcbarService.open(message)
      }, (err: CustomizedHttpErrorResponse) => {
        this.globalErrorHandler.handleHttpError(err)
      })
    }
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

}
