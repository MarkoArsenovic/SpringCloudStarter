import { Component, OnInit, ViewChild, Inject, Optional, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Service } from '../shared/models/service';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-services-form',
  templateUrl: './services-form.component.html',
  styleUrls: ['../shared/styles/form-in-dialog.scss', './services-form.component.scss']
})
export class ServicesFormComponent implements OnInit, OnDestroy {

  public service: Service = new Service();

  @ViewChild('f', { static: true }) form: NgForm;

  @Output() formOutput: EventEmitter<Service> = new EventEmitter<Service>();

  constructor(public dialogRef: MatDialogRef<ServicesFormComponent>, public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      this.service = this.data.passedService;
    }
  }

  submitForm() {
    this.formOutput.emit(this.service);
  }

  ngOnDestroy() {
    /**
     * Unsubscribing all subscribers from the output.
     */
    this.formOutput.complete();
  }

}
