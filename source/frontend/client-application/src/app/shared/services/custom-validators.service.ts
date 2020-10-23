import { Injectable } from '@angular/core';
import { ValidatorFn, FormControl, FormGroupDirective, NgForm, FormGroup, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * See links for detailed explanation:
 * https://material.angular.io/components/input/overview
 * https://itnext.io/materror-cross-field-validators-in-angular-material-7-97053b2ed0cf
 */
export class ConfirmPasswordErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return ((control.invalid || control.parent.invalid) && (control.touched || isSubmitted));
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  trimWhiteSpaceValidator(): ValidatorFn {
    const validator: ValidatorFn = (control: FormControl) => {

      const value = String(control.value);

      if (value) {
        return value.trim() ? null : { required: true }
      } else {
        return null;
      }
    }

    return validator;

  }

  confirmPasswordValidator(): ValidatorFn {
    const validator: ValidatorFn = (control: FormGroup) => {

      const password = control.get('password').value;
      const confirmPassword = control.get('confirmPassword').value;

      if ((password && confirmPassword) && (password !== confirmPassword)) {
        return { unmatchingPasswords: true }
      } else {
        return null;
      }

    }

    return validator;

  }

  multiselectCheckboxesRequiredValidator(): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {

      const allCheckboxes = formArray.value;

      // if required validation rule is satisfied, this will be true
      let checkRequiredValidationRule: boolean = false;

      allCheckboxes.forEach(checkbox => {
        if (checkbox) {
          checkRequiredValidationRule = true
        }
      })

      return checkRequiredValidationRule ? null : { required: true }
    }

    return validator;

  }

}
