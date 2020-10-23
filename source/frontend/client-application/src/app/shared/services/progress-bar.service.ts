import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export interface ProgressBarState {
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  private progressBarSubject = new Subject<ProgressBarState>();
  progressBarState$ = this.progressBarSubject.asObservable();

  private httpProgressBarSubject = new Subject<ProgressBarState>();
  httpProgressBarState$ = this.httpProgressBarSubject.asObservable();

  constructor() { }

  show() {
    this.progressBarSubject.next({ show: true });
  }

  hide() {
    this.progressBarSubject.next({ show: false });
  }

  // should be used only from HTTP interceptor, for custom usage use show() and hide() methods
  httpShow() {
    this.httpProgressBarSubject.next({ show: true });
  }

  // should be used only from HTTP interceptor, for custom usage use show() and hide() methods
  httpHide() {
    this.httpProgressBarSubject.next({ show: false });
  }

}
