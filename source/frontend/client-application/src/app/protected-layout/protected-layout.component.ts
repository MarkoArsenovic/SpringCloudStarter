import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';
import { BOOTSTRAP_RESPONSIVE_BREAKPOINTS } from '../shared/utils/const';
import { ScreenSize } from '../shared/types/screen-size';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProtectedLayoutService } from '../shared/services/protected-layout.service';

@Component({
  selector: 'app-protected-layout',
  templateUrl: './protected-layout.component.html',
  styleUrls: ['./protected-layout.component.scss']
})
export class ProtectedLayoutComponent implements OnInit, OnDestroy {
  
  @ViewChild('userDashboardWrapper', { static: true }) userDashboardWrapper: ElementRef;
  
  subscriptions: Subscription = new Subscription();

  changedToDesktopSize: boolean = false;
  changedToMobileSize: boolean = false;

  onAboutUsPage: boolean;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {

    /**
     * Reducing the number of calls to resetSidebarClasses() method, by calling it only
     * in the moment that window size changes from destkop to mobile and vice versa
     */
    if (event.target.innerWidth >= BOOTSTRAP_RESPONSIVE_BREAKPOINTS.largeDevices.minWidth) {
      this.changedToMobileSize = false;
      if (this.changedToDesktopSize) {
        return;
      } else {
        this.changedToDesktopSize = true;
      }
    } else {
      this.changedToDesktopSize = false;
      if (this.changedToMobileSize) {
        return;
      } else {
        this.changedToMobileSize = true;
      }
    }

    this.resetSidebarClasses();
  }

  constructor(private renderer: Renderer2, private router: Router, private protectedLayoutService: ProtectedLayoutService) { }

  ngOnInit() {
    this.resetSidebarClasses();

    // Close sidebar on route change on mobile devices
    const routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && this.userDashboardWrapper.nativeElement.classList.contains('sidebar-shown-mobile')) {
        this.hideSidebar('mobile')
      }
    })

    const aboutUsPageSubscription = this.protectedLayoutService.aboutUsPageIndicator$.subscribe((onAboutUsPage: boolean) => {
      // To avoid change detection errors
      setTimeout(() => {
        this.onAboutUsPage = onAboutUsPage
      });
    })

    this.subscriptions.add(routerSubscription);
    this.subscriptions.add(aboutUsPageSubscription);
  }

  toggleSidebar() {
    if (window.innerWidth >= BOOTSTRAP_RESPONSIVE_BREAKPOINTS.largeDevices.minWidth) {
      if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-hidden-desktop')) {
        this.showSidebar('desktop')
      } else {
        this.hideSidebar('desktop')
      }
    } else {
      if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-shown-mobile')) {
        this.hideSidebar('mobile')
      } else {
        this.showSidebar('mobile')
      }
    }
  }

  hideSidebar(screenSize: ScreenSize) {
    if (screenSize === 'mobile') {
      this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-mobile');
      this.renderer.addClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-mobile');
    } else {
      this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-desktop');
      this.renderer.addClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-desktop');
    }
  }

  showSidebar(screenSize: ScreenSize) {
    if (screenSize === 'mobile') {
      this.renderer.addClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-mobile');
      this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-mobile');
    } else {
      this.renderer.addClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-desktop');
      this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-desktop');
    }
  }

  resetSidebarClasses() {
    if (window.innerWidth >= BOOTSTRAP_RESPONSIVE_BREAKPOINTS.largeDevices.minWidth) {

      if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-shown-mobile')) {
        this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-mobile')
      } else if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-hidden-mobile')) {
        this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-mobile')
      }

    } else {

      if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-shown-desktop')) {
        this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-shown-desktop')
      } else if (this.userDashboardWrapper.nativeElement.classList.contains('sidebar-hidden-desktop')) {
        this.renderer.removeClass(this.userDashboardWrapper.nativeElement, 'sidebar-hidden-desktop')
      }

    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

}
