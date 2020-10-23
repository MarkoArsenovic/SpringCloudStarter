import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LoginData } from '../shared/models/login-data';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../shared/styles/public-route-form.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private globalErrorHandler: GlobalErrorHandlerService) { }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.valid) {

      const loginData: LoginData = this.loginForm.value;

      this.auth.login(loginData).subscribe(
        () => { },
        (err: CustomizedHttpErrorResponse) => {
          this.globalErrorHandler.handleHttpError(err)
        }
      );
    }
  }

  get f() {
    return this.loginForm.controls;
  }

}
