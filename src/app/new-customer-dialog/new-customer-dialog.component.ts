import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-customer-dialog',
  templateUrl: './new-customer-dialog.component.html',
  styleUrls: ['./new-customer-dialog.component.scss']
})
export class NewCustomerDialogComponent {
  groupSize = 0;

  constructor(public dialogRef: MatDialogRef<NewCustomerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {totalSeats: number}) {
  }

  cancel():void {
    this.dialogRef.close();
  }
}
