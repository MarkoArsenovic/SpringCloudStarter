import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { LOCAL_STORAGE_KEYS } from '../shared/utils/const';
import { UserInfo } from '../shared/models/user-info';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  userFirstNameFirstLetter: string;

  constructor(private auth: AuthenticationService) { 
    const userInfo: UserInfo =  JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEYS.userInfo));
    this.userFirstNameFirstLetter = userInfo.user.name.charAt(0).toUpperCase();
  }

  ngOnInit(): void {
  }

  triggerSidebarToggle() {
    this.toggleSidebarEvent.emit();
  }

  logout() {
    this.auth.logout();
  }

}
