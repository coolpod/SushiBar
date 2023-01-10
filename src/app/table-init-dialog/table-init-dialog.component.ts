import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-table-init-dialog',
  templateUrl: './table-init-dialog.component.html',
  styleUrls: ['./table-init-dialog.component.scss']
})
export class TableInitDialogComponent {
  totalSeats = 1;

  constructor(public dialogRef: MatDialogRef<TableInitDialogComponent>) {
  }
}
