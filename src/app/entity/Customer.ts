export class Customer{
  id: number;
  firstSeat: number;
  groupSize: number;

  constructor(id:number, firstSeat:number, groupSize:number) {
    this.id = id;
    this.firstSeat = firstSeat;
    this.groupSize = groupSize;
  }
}