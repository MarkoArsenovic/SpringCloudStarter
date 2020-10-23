import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MicroservicesDashboardComponent } from './microservices-dashboard/microservices-dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProtectedLayoutComponent } from './protected-layout/protected-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RolesDashboardComponent } from './roles-dashboard/roles-dashboard.component';
import { RolesFormComponent } from './roles-form/roles-form.component';
import { HomeComponent } from './home/home.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { JwtInterceptorService } from './shared/interceptors/jwt-interceptor.service';
import { RefreshTokenInterceptorService } from './shared/interceptors/refresh-token.service';
import { HttpErrorConverterService } from './shared/interceptors/http-error-converter.service';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';
import { ProgressBarInterceptorService } from './shared/interceptors/progress-bar-interceptor.service';
import { GlobalHttpErrorInterceptorService } from './shared/interceptors/global-http-error-interceptor.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { HasPermissionDirective } from './shared/directives/has-permission.directive';
import { UpdateUserRolesFormComponent } from './update-user-roles-form/update-user-roles-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ServicesDashboardComponent } from './services-dashboard/services-dashboard.component';
import { ServicesFormComponent } from './services-form/services-form.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { PermissionsDashboardComponent } from './permissions-dashboard/permissions-dashboard.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AboutUsComponent } from './about-us/about-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    MicroservicesDashboardComponent,
    LoginComponent,
    ProtectedLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RolesDashboardComponent,
    RolesFormComponent,
    HomeComponent,
    ProgressBarComponent,
    ConfirmDialogComponent,
    ForgotPasswordComponent,
    PublicLayoutComponent,
    ResetPasswordComponent,
    UsersDashboardComponent,
    HasPermissionDirective,
    UpdateUserRolesFormComponent,
    UserProfileComponent,
    ServicesDashboardComponent,
    ServicesFormComponent,
    UserProfileFormComponent,
    ChangePasswordFormComponent,
    PermissionsDashboardComponent,
    AboutUsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressBarInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorConverterService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
