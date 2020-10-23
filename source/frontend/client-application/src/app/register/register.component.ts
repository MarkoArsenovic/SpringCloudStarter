import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserRegister } from '../shared/models/user-register';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { CustomValidatorsService, ConfirmPasswordErrorMatcher } from '../shared/services/custom-validators.service';
import { SnackbarService } from '../shared/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../shared/styles/public-route-form.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
    lastname: ['', [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
    username: ['', [Validators.required, Validators.maxLength(30), this.customValidatorsService.trimWhiteSpaceValidator()]],
    email: ['', [Validators.required, Validators.maxLength(70), Validators.email, this.customValidatorsService.trimWhiteSpaceValidator()]],
    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.maxLength(40), Validators.minLength(8), this.customValidatorsService.trimWhiteSpaceValidator()]],
      confirmPassword: ['', [Validators.required, this.customValidatorsService.trimWhiteSpaceValidator()]]
    }, { validators: this.customValidatorsService.confirmPasswordValidator() })
  });

  errorMatcher = new ConfirmPasswordErrorMatcher();

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private globalErrorHandler: GlobalErrorHandlerService,
    private snackbarService: SnackbarService, private router: Router, private customValidatorsService: CustomValidatorsService) { }

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.valid) {
      const name: string = this.f.name.value
      const lastname: string = this.f.lastname.value
      const username: string = this.f.username.value
      const email: string = this.f.email.value
      const password: string = this.getNestedFormControl('passwords', 'password').value
      const confirmPassword: string = this.getNestedFormControl('passwords', 'confirmPassword').value

      const user = new UserRegister(name, lastname, username, email, password, confirmPassword)

      this.auth.register(user).subscribe(() => {
        const message = "Registration successful!"
        this.snackbarService.open(message)

        this.router.navigateByUrl('/login')
      }, (err: CustomizedHttpErrorResponse) => {
        this.globalErrorHandler.handleHttpError(err)
      })
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  getNestedFormControl(...nestingParams: Array<string>): AbstractControl {
    /**
     * Using the technique from this answer https://stackoverflow.com/questions/49269403/how-to-get-nested-formgroups-controls-in-angular/57508505#57508505
     */
    return this.registerForm.get(nestingParams);
  }

}
