import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user';
import { CustomizedHttpErrorResponse } from '../shared/models/customized-http-error-response';
import { GlobalErrorHandlerService } from '../shared/services/global-error-handler.service';
import { UserProfileService } from '../services/user-profile.service';
import { DialogService } from '../shared/services/dialog.service';
import { UserProfileFormComponent } from '../user-profile-form/user-profile-form.component';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;
  userPropertiesArray: Array<any> = [];


  constructor(private dialogService: DialogService,
    private userProfileService: UserProfileService, private globalErrorHandler: GlobalErrorHandlerService) { }

  ngOnInit() {
    this.getProfile()
  }

  getProfile() {
    this.userProfileService.getProfile().subscribe((user: User) => {

      this.user = user;
      const formattedUserRoles = []

      this.user.userRoles.forEach(role => {
        formattedUserRoles.push(role.name)
      });

      const formattedUserObject: any = Object.assign({}, this.user);

      formattedUserObject.userRoles = formattedUserRoles;
      this.userDataBeautify(formattedUserObject)

    }, (err: CustomizedHttpErrorResponse) => {
      this.globalErrorHandler.handleHttpError(err)
    })
  }

  userDataBeautify(user: any) {
    this.userPropertiesArray = [];
    Object.entries(user).forEach(el => {
      if (el[0] === 'userRoles') {
        el[1] = Array(el[1]);
        // way to convert array elements to strigns adn add comma and space between
        el[1] = el[1][0].join(', ')
      }
      // show all properties except id
      if (el[0] !== 'id') {
        el[0] = el[0].charAt(0).toLocaleUpperCase() + el[0].slice(1)
        el[0] = el[0].replace(/([a-z])([A-Z])/g, '$1 $2');
        this.userPropertiesArray.push(el)
      }
    })
  }

  openChangePasswordModal() {
    this.dialogService.open(ChangePasswordFormComponent, {
      autoFocus: false
    }).afterClosed().subscribe(res => {
      if (res) {
        this.getProfile()
      }
    })
  }

  editUser() {

    this.userProfileService.getProfile().subscribe(user => {

      this.dialogService.open(UserProfileFormComponent, {
        autoFocus: false,
        data: { user }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.getProfile()
        }
      })

    }, (err: CustomizedHttpErrorResponse) => {
      const message = 'Cannot get profile data!'
      this.globalErrorHandler.handleHttpError(err, message)
    })
  }


}
