import { Injectable } from '@angular/core';
import { SNACK_BAR_DEFAULT_ERROR_MESSAGE } from '../utils/const';
import { CustomizedHttpErrorResponse } from '../models/customized-http-error-response';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  constructor(private snackBarService: SnackbarService) { }

  handleHttpError(err: CustomizedHttpErrorResponse, errorMessage = SNACK_BAR_DEFAULT_ERROR_MESSAGE) {
    if (err instanceof CustomizedHttpErrorResponse) {
      if (!(err.customFields.messageShown || err.customFields.blockMessageShowing)) {
        this.snackBarService.open(errorMessage);
        err.customFields.messageShown = true;
      }
    }
  }

}
