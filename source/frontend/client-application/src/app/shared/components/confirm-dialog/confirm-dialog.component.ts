import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmButtonLabels {
  confirm: string,
  cancel: string
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  public message: any
  public buttonLabels: ConfirmButtonLabels = {
    confirm: 'Yes',
    cancel: 'No'
  }

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.message = this.data.message
    if (this.data.buttonLabels) {
      this.buttonLabels = this.data.buttonLabels
    }
  }

}
