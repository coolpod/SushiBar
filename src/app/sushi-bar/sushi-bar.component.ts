import { Component, ViewChild } from '@angular/core';
import { Customer } from '../entity/Customer';
import { EmptySeatRow } from '../entity/EmptySeatRow';
import { TableInitDialogComponent } from '../table-init-dialog/table-init-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RemoveCustomerDialogComponent } from '../remove-customer-dialog/remove-customer-dialog.component';
import { NewCustomerDialogComponent } from '../new-customer-dialog/new-customer-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sushi-bar',
  templateUrl: './sushi-bar.component.html',
  styleUrls: ['./sushi-bar.component.scss']
})

/**
 * This is the Sushi Bar's main component
 * 
 * @property {number} totalSeats total number of available seats at the sushi bar
 * @property {number} customerCount counter for customer ID
 * @property {Array<string>} displayedColumns array of columns that should be displayed in the customer table
 * @property {Array<number>} sushiTable essentially the seating plan
 * @property {Array<Customer>} customers array of all customer groups
 * @property {Array<EmptySeatRow>} emptySeats array of all open seat rows at the sushi bar
 */
export class SushiBarComponent {
  totalSeats = 0;
  customerCount = 0;
  displayedColumns = ['id', 'occupiedSeats', 'groupSize', 'removeCustomer'];
  sushiTable: number[] = [];
  customers: Customer[] = [];
  emptySeats: EmptySeatRow[] = [];

  @ViewChild(MatTable) customerTable!: MatTable<Customer>;

  /**
   * This is the constructor of the class
   * 
   * @param dialog 
   * @param _snackBar 
   */
  constructor(public dialog: MatDialog,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.openTableInitDialog();
  }

  /**
   * This function opens the dialog to input the number of available seats
   */
  openTableInitDialog(): void {
    const dialogRef = this.dialog.open(TableInitDialogComponent, {
      width: '420px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.initSushiBar(result);
    });
  }

  /**
   * This function opens the dialog for adding new customers to the sushi bar
   */
  openNewCustomerDialog(): void {
    const dialogRef = this.dialog.open(NewCustomerDialogComponent, {
      width: '420px',
      data: {totalSeats: this.totalSeats},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addCustomer(result);
    });
  }

  /**
   * This function opens a dialog for removing customers from the sushi bar
   * 
   * @param id the customer ID of the customer that should be removed
   */
  openRemoveCustomerDialog(id: number): void {
    const dialogRef = this.dialog.open(RemoveCustomerDialogComponent, {
      width: '420px',
      data: this.customers.find((element) => element.id == id),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.removeCustomer(result);
    });
  }

  /**
   * This function initializes the sushi bar with the given number of available seats.
   * 
   * @param totalSeats the number of avaible seats at the sushibar
   */
  initSushiBar(totalSeats: number): void {
    this.totalSeats = totalSeats;
    this.sushiTable = new Array(this.totalSeats).fill(0);
    this.emptySeats.push(new EmptySeatRow(0, this.totalSeats));
  }

  /**
   * This function checks if a new customer group with the given group size can be added to the sushi bar.
   * If the group can be added, all the arrays will be updated.
   * 
   * @param groupSize the size of the customer group that should be addded
   */
  addCustomer(groupSize: number): void {
    let foundSeat = false;
    let i = 0;

    // sorting empty seat rows in ascending order
    this.sortEmptySeatsAsc();
    
    //checks for empty seat
    while (!foundSeat && i < this.emptySeats.length) {
      if (groupSize <= this.emptySeats[i].quantity) {
        foundSeat = true;
        this.customerCount++;
        const customer = new Customer(this.customerCount, this.emptySeats[i].position, groupSize);

        //add customer to array
        this.customers.push(customer)
        
        // add customer to sushi table, % totalSeats imitates circular array
        for (let j = customer.firstSeat; j < customer.firstSeat + customer.groupSize; j++) {
          this.sushiTable.splice(j % this.totalSeats, 1, customer.id);
        }

         //update empty seats
        this.updateEmptySeats();
      }
      i++
    }

    // snackbar message 
    if (foundSeat) {
      this.openSnackBar('Neue Gäste erfolgreich hinzugefügt! (GNr. ' + this.customerCount + ')','OK');
    } else {
      this.openSnackBar('Keine passenden Plätze mehr verfügbar!','OK');
    }
  }

  /**
   * This function removes the given customer and updates all the arrays.
   * 
   * @param customer the customer group that should be removed
   */
  removeCustomer(customer: Customer): void {
    // opens up new seats on the table
    // i % this.totalSeats imitates circular array
    for (let i = customer.firstSeat; i < customer.firstSeat + customer.groupSize; i++) {
      this.sushiTable.splice(i % this.totalSeats, 1, 0);
    }

    // removes customer from the customers array
    const deleteIndex = this.customers.findIndex((element) => element.id == customer.id);
    this.customers.splice(deleteIndex, 1);

    // updates empty seats
    this.updateEmptySeats();

    // snackbar message
    this.openSnackBar('Gäste mit der GNr. ' + customer.id + ' erfolgreich entfernt!','OK');
  }

  /**
   * This function scans the sushi bar for empty seats and adds them to the emptySeats array.
   */
  updateEmptySeats(): void {
    let seatCounter = 0;
    let tempSeatRow = new EmptySeatRow(0,0);
    this.emptySeats = [];

    for (let i = 0; i < this.totalSeats; i++) {
      
      if (this.sushiTable[i] == 0 && seatCounter == 0) {
        // in case of first open seat
        tempSeatRow.position = i;
        seatCounter++;
      } else if (this.sushiTable[i] == 0 && seatCounter > 0) {
        // in case of following open seat
        seatCounter++;
      } else if (this.sushiTable[i] !== 0 && seatCounter > 0) {
        // in case of a occupied seat after an empty seat
        tempSeatRow.quantity = seatCounter;
        this.emptySeats.push(tempSeatRow);
        seatCounter = 0;
        tempSeatRow = new EmptySeatRow(0,0);
      }
    }

    if (this.sushiTable[this.sushiTable.length - 1] == 0 ) {
      // in case last seat on the table is empty
      tempSeatRow.quantity = seatCounter;
      this.emptySeats.push(tempSeatRow);
      seatCounter = 0;
      tempSeatRow = new EmptySeatRow(0,0);
    }

    // connect seats if in case last seat and first seat are empty
    if (this.emptySeats.length > 1 && this.sushiTable[0] == 0 && this.sushiTable[this.totalSeats - 1] == 0) {
      this.emptySeats[this.emptySeats.length-1].quantity += this.emptySeats[0].quantity;
      this.emptySeats.splice(0,1);
    }

    this.customerTable.renderRows();

  }

  /**
   * This function sorts the empty seat rows by the size of the row in ascending order.
   */
  sortEmptySeatsAsc(): void {
    if (this.emptySeats.length > 1) {
      this.emptySeats.sort(
        (el1, el2) => el1.quantity - el2.quantity
      );
    }
  }

  /**
   * This function is a helping function for the *ngFor-directives which only lets to iterate over an array.
   * 
   * @param i the desired size of array
   * @returns an array with the size of i
   */
  counter(i: number): Array<number> {
    return new Array(i);
  }

  /**
   * This is a helping function for the *ng-directives that don't have access to the Math-library.
   * It takes the given number and rounds it up.
   * 
   * @param i the number to be rounded up
   * @returns the rounded number
   */
  mathCeil(i: number): number {
    return Math.ceil(i);
  }

  /**
   * This is a helping function for the *ng-directives that don't have access to the Math-library.
   * It takes the given number and rounds it down.
   * 
   * @param i the number to be rounded down
   * @returns the rounded number
   */
  mathFloor(i: number): number {
    return Math.floor(i);
  }

  /**
   * This function opens the snack bar with the given message and action string.
   * 
   * @param message the message to be displayed in the snackbar
   * @param action the string that should be displayed on the action button
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {duration: 5500});
  }
}
