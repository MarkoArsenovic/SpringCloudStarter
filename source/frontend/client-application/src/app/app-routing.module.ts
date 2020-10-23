import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { MicroservicesDashboardComponent } from './microservices-dashboard/microservices-dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProtectedLayoutComponent } from './protected-layout/protected-layout.component';
import { RolesDashboardComponent } from './roles-dashboard/roles-dashboard.component';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/guest.guard';
import { PermissionsGuard } from './shared/guards/permissions.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ServicesDashboardComponent } from './services-dashboard/services-dashboard.component';
import { PermissionsDashboardComponent } from './permissions-dashboard/permissions-dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password/:id/:token',
        component: ResetPasswordComponent
      }
    ]
  },
  {
    path: '',
    component: ProtectedLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard, PermissionsGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', redirectTo: 'about-us', pathMatch: 'full' },
      {
        path: 'about-us',
        component: AboutUsComponent
      },
      {
        path: 'microservices',
        component: MicroservicesDashboardComponent
      },
      {
        path: 'iam/roles',
        component: RolesDashboardComponent
      },
      {
        path: 'iam/users',
        component: UsersDashboardComponent
      },
      {
        path: 'iam/services',
        component: ServicesDashboardComponent
      },
      {
        path: 'iam/permissions',
        component: PermissionsDashboardComponent
      },
      {
        path: 'my-profile',
        component: UserProfileComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
