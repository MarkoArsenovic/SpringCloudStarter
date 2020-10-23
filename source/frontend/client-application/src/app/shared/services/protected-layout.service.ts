import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProtectedLayoutService {

  aboutUsPageIndicator$ = new Subject<boolean>()

  constructor() { }
}
