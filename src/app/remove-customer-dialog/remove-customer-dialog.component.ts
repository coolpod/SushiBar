import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../entity/Customer';

@Component({
  selector: 'app-remove-customer-dialog',
  templateUrl: './remove-customer-dialog.component.html',
  styleUrls: ['./remove-customer-dialog.component.scss']
})
export class RemoveCustomerDialogComponent {
  constructor(public dialogRef: MatDialogRef<RemoveCustomerDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Customer) {
  }

  cancel():void {
    this.dialogRef.close();
  }
}
