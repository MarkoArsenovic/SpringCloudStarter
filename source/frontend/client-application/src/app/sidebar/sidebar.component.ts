import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  animation,
  useAnimation
} from '@angular/animations';
import { Router, Event, NavigationEnd } from '@angular/router';
import { BOOTSTRAP_RESPONSIVE_BREAKPOINTS, IAM_SERVICES_DATA, PERMISSION_STRINGS } from '../shared/utils/const';
import { Subscription } from 'rxjs';


export const slideOutAnimation = animation([
  group([
    animate('400ms ease-in-out', style({
      'height': '*'
    })),
    animate('600ms ease-in-out', style({
      'opacity': '1'
    }))
  ]
  )]);

export const slideInAnimation = animation([
  group([
    animate('400ms ease-in-out', style({
      'opacity': '0'
    })),
    animate('400ms ease-in-out', style({
      'height': '0'
    }))
  ]
  )]);

export const slideToggleReusableTrigger = [
  state('opened', style({
    'height': '*', 'opacity': '1'
  })),
  state('closed', style({
    'height': '0', 'opacity': '0'
  })),
  transition('opened => closed', [useAnimation(slideInAnimation)]),
  transition('closed => opened', [useAnimation(slideOutAnimation)])
]

export const iconRotateReusableTrigger = [
  state('opened', style({
    'transform': 'rotate(-180deg)'
  })),
  state('closed', style({
    'transform': 'none'
  })),
  transition('opened => closed', animate('400ms ease-in-out')),
  transition('closed => opened', animate('400ms ease-in-out'))
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideToggleIam', slideToggleReusableTrigger),
    trigger('iconRotateIam', iconRotateReusableTrigger)
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  services = IAM_SERVICES_DATA;
  permissionStrings = PERMISSION_STRINGS;

  animationsDisabled: boolean = false;

  slideAnimationStates = {
    slideAnimationStateIam: 'closed'
  }

  subscriptionsArray: Array<Subscription> = [];

  constructor(private router: Router) {
  }

  ngOnInit() {

    const routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth >= BOOTSTRAP_RESPONSIVE_BREAKPOINTS.largeDevices.minWidth) {
          // Comment out if you want that all dropdowns close on navigation change
          // this.closeAllDropdowns()
        } else {
          this.animationsDisabled = true;
          this.closeAllDropdowns()
        }

      }
    })

    this.subscriptionsArray.push(routerSubscription);
  }

  toggleDropDown(state: string) {
    this.animationsDisabled = false;
    this.slideAnimationStates[state] = this.slideAnimationStates[state] === 'closed' ? 'opened' : 'closed';
  }

  closeAllDropdowns() {
    Object.keys(this.slideAnimationStates).forEach(state => {
      this.slideAnimationStates[state] = 'closed'
    })
  }

  ngOnDestroy() {
    this.subscriptionsArray.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
