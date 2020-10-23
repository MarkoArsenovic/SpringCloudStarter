import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private defaultValues = {
    width: '600px',
    maxWidth: '95vw',
    maxHeight: '100vh'
  }

  constructor(public dialog: MatDialog) { }

  /**
   * Wrapper around open() method on material dialog with some default config values. Opens a modal dialog containing the given component.
   * @param componentOrTemplateRef Type of the component to load into the dialog,
   *     or a TemplateRef to instantiate as the dialog content.
   * @param config Extra configuration options.
   * @param useDefaultValues If true, default values will be used (they will override values specified inside config param)
   * @returns Reference to the newly-opened dialog.
   */
  open<T, D = any, R = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>, useDefaultValues: boolean = true): MatDialogRef<T, R> {

    if (useDefaultValues) {
      config = {...config, ...this.defaultValues}
    }

    return this.dialog.open(componentOrTemplateRef, config)

  }

}
