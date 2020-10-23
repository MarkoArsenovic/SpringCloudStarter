import { Component, OnInit, ViewChild, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Role } from '../shared/models/role';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['../shared/styles/form-in-dialog.scss', './roles-form.component.scss']
})
export class RolesFormComponent implements OnInit, OnDestroy {

  public role: Role = new Role();

  @ViewChild('f', { static: true }) form: NgForm;

  @Output() formOutput: EventEmitter<Role> = new EventEmitter<Role>();

  constructor(public dialogRef: MatDialogRef<RolesFormComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      this.role = this.data.passedRole;
    }
  }

  submitForm() {
    this.formOutput.emit(this.role);
  }

  ngOnDestroy() {
    /**
     * Unsubscribing all subscribers from the output.
     */
    this.formOutput.complete();
  }

}
