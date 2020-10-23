import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProtectedLayoutService } from '../shared/services/protected-layout.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {

  constructor(private protectedLayoutService: ProtectedLayoutService) { }

  ngOnInit(): void {
    this.protectedLayoutService.aboutUsPageIndicator$.next(true)
  }

  ngOnDestroy(): void {
    this.protectedLayoutService.aboutUsPageIndicator$.next(false)
  }

}
