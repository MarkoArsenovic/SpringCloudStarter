import { Injectable } from '@angular/core';
import { NgForm, FormGroup, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  checkFormValidity(form: FormGroup | NgForm): boolean {
    if (form.valid) {
      return true
    } else {
      this.markAllControlsAsTouched(form)
      this.scrollAndFocusFirstInvalidControl()
      return false
    }
  }

  markAllControlsAsTouched(form: FormGroup | NgForm) {
    if (form instanceof FormGroup) {
      form.markAllAsTouched()
    } else {
      // https://stackoverflow.com/questions/58957277/template-driven-form-mark-all-as-touched-angular-7/62633541#62633541
      form.form.markAllAsTouched()
    }
  }

  scrollAndFocusFirstInvalidControl() {
    if (document) {
      const firstInvalidFormField = document.querySelector('form .ng-invalid') as HTMLElement
      const scrollToElement = firstInvalidFormField?.closest('.form-group')
      scrollToElement?.scrollIntoView()
      firstInvalidFormField?.focus()
    }
  }

  getNestedFormControl(form: FormGroup, ...nestingParams: Array<string>): AbstractControl {
    /**
     * Using the technique from this answer https://stackoverflow.com/questions/49269403/how-to-get-nested-formgroups-controls-in-angular/57508505#57508505
     */
    return form.get(nestingParams);
  }

 /**
  * Prevents blur event happening before click event and blocking it (this was happening
  * when for instance, user has clicked on submit button, but blur event on form field triggers
  * first and shows the validation error, which blocks the click event). Related target should contain
  * the class 'panonit-form-action' in order for this to work.
  */
  inputBlurHandler(event: any, form: FormGroup | NgForm, formFieldIdentifier: string) {
    if (event.relatedTarget) {
      if (event.relatedTarget.classList.contains('panonit-form-action')) {
        form.controls[formFieldIdentifier].markAsUntouched()
      }
    }
  }

}
