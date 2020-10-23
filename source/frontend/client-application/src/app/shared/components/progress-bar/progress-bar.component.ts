import { Component, OnInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { ProgressBarService, ProgressBarState } from '../../services/progress-bar.service';
import { Subscription } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  @ViewChild('progressBar', { static: true }) progressBar: MatProgressBar;

  subscription: Subscription;
  httpSubscription: Subscription;

  // Introduced for multiple HTTP requests happening at the sime time (if we would have
  // a boolean instead, first finished HTTP request would remove progress bar even if others
  // are still active)
  httpShowCounter: number = 0;
  // Introduced for multiple custom progress bar activations (manually activated by programmer, 
  // not automatically activated by HTTP request) happening at the sime time
  showCounter: number = 0;

  constructor(private progressBarService: ProgressBarService, private renderer: Renderer2) { }

  ngOnInit() {
    this.subscription = this.progressBarService.progressBarState$
      .subscribe((state: ProgressBarState) => {
        if (state.show === true) {
          this.showCounter++
        } else {
          if (this.showCounter > 0)
            this.showCounter--
        }
        this.updateProgressBarVisibility()
      });

    this.httpSubscription = this.progressBarService.httpProgressBarState$
      .subscribe((state: ProgressBarState) => {
        if (state.show === true) {
          this.httpShowCounter++
        } else {
          if (this.httpShowCounter > 0)
            this.httpShowCounter--
        }
        this.updateProgressBarVisibility()
      });

  }

  /**
   * This approach is chosen because when using [hidden] directive on mat-progress-bar html element,
   * expression changed after checked error ocurres sometimes.
   */
  updateProgressBarVisibility() {
    if (this.httpShowCounter === 0 && this.showCounter === 0) {
      // _elementRef is not a private property of MatProgressBar, so it should be safe to use it
      this.renderer.setStyle(this.progressBar._elementRef.nativeElement, 'display', 'none')
    } else {
      this.renderer.setStyle(this.progressBar._elementRef.nativeElement, 'display', 'block')
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.httpSubscription.unsubscribe()
  }

}
