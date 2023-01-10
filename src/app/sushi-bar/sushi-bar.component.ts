import { Component, ViewChild } from '@angular/core';
import { Customer } from '../entity/Customer';
import { EmptySeatRow } from '../entity/EmptySeatRow';
import { TableInitDialogComponent } from '../table-init-dialog/table-init-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RemoveCustomerDialogComponent } from '../remove-customer-dialog/remove-customer-dialog.component';
import { NewCustomerDialogComponent } from '../new-customer-dialog/new-customer-dialog.component';

@Component({
  selector: 'app-sushi-bar',
  templateUrl: './sushi-bar.component.html',
  styleUrls: ['./sushi-bar.component.scss']
})
export class SushiBarComponent {
  totalSeats = 0;
  customerCount = 0;
  displayedColumns = ['id', 'occupiedSeats', 'groupSize', 'removeCustomer'];
  sushiTable: number[] = [];
  customers: Customer[] = [];
  emptySeats: EmptySeatRow[] = [];

  @ViewChild(MatTable) customerTable!: MatTable<Customer>;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.openTableInitDialog();
  }

  openTableInitDialog(): void {
    const dialogRef = this.dialog.open(TableInitDialogComponent, {
      width: '420px',
      data: {totalSeats: this.totalSeats},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.initSushiBar(result);
    });
  }

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

  initSushiBar(totalSeats: number): void {
    this.totalSeats = totalSeats;
    this.sushiTable = new Array(this.totalSeats).fill(0);
    this.emptySeats.push(new EmptySeatRow(0, this.totalSeats));
  }

  addCustomer(groupSize: number): void {
    let foundSeat = false;
    let i = 0;

    // sorting empty seat rows in ascending order
    this.sortEmptySeats();
    
    //checks for empty seat
    while (!foundSeat && i < this.emptySeats.length) {
      if (groupSize <= this.emptySeats[i].quantity) {
        foundSeat = true;
        this.customerCount++;
        // firstEmptySeat = this.emptySeats[i].position;
        const customer = new Customer(this.customerCount, this.emptySeats[i].position, groupSize);

        //add customer to array
        this.customers.push(customer)
        
        // add customer to suhsi table
        for (let j = customer.firstSeat; j < customer.firstSeat + customer.groupSize; j++) {
          this.sushiTable.splice(j % this.totalSeats, 1, customer.id);
        }

         //update empty seats
        this.updateEmptySeats();

        //test
        console.log("found seat");
      }
      i++
    }

  }

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
  }

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

    //render table
    this.customerTable.renderRows();

  }

  sortEmptySeats(): void {
    if (this.emptySeats.length > 1) {
      this.emptySeats.sort(
        (el1, el2) => el1.quantity - el2.quantity
      );
    }
  }

  counter(i: number): Array<number> {
    return new Array(i);
  }

  mathCeil(i: number): number {
    return Math.ceil(i);
  }

  mathFloor(i: number): number {
    return Math.floor(i);
  }

}
