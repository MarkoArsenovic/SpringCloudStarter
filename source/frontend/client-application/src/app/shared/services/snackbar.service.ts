import { Injectable } from '@angular/core';
import { NotificationDurationRange } from '../interfaces/notification-duration-range';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { NOTIFICATION_EXTRA_SHORT_DURATION_RANGE } from '../utils/const';
import { NOTIFICATION_SHORT_DURATION_RANGE } from '../utils/const';
import { NOTIFICATION_MEDIUM_DURATION_RANGE } from '../utils/const';
import { NOTIFICATION_LONG_DURATION_RANGE } from '../utils/const';
import { NOTIFICATION_EXTRA_LONG_DURATION_RANGE } from '../utils/const';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private snakcBarDurationRanges: Array<NotificationDurationRange> = [
    NOTIFICATION_EXTRA_SHORT_DURATION_RANGE,
    NOTIFICATION_SHORT_DURATION_RANGE,
    NOTIFICATION_MEDIUM_DURATION_RANGE,
    NOTIFICATION_LONG_DURATION_RANGE,
    NOTIFICATION_EXTRA_LONG_DURATION_RANGE
  ]

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Wrapper around open() method on material snackbar with default action string, 
   * and with calculated duration (based on number of characters in message) by default.
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param calculateDuration If true, duration will be calculated and duration inside config param will be overriden.
   * @param config Additional configuration options for the snackbar.
   */
  open(message: string, action: string = "OK", calculateDuration: boolean = true, config?: MatSnackBarConfig): MatSnackBarRef<TextOnlySnackBar> {

    if (calculateDuration) {

      const calculatedDuration = this.calculateSnackBarDuration(message);

      if (config) {
        config.duration = calculatedDuration
      } else {
        config = { duration: calculatedDuration }
      }

    }

    return this.snackBar.open(message, action, config);
  }

  private calculateSnackBarDuration(message: string) {
    // Removing ALL whitespace from string and counting remaining characters
    const numberOfMessageCharacters: number = message.replace(/\s+/g, '').length;
    let snackBarDuration: number;

    this.snakcBarDurationRanges.forEach((range: NotificationDurationRange) => {
      if (numberOfMessageCharacters >= range.minChar && numberOfMessageCharacters < range.maxChar) {
        snackBarDuration = range.duration;
      }
    });

    return snackBarDuration;
  }

}
