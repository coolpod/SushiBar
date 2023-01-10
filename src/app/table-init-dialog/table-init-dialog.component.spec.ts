import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInitDialogComponent } from './table-init-dialog.component';

describe('TableInitDialogComponent', () => {
  let component: TableInitDialogComponent;
  let fixture: ComponentFixture<TableInitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableInitDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableInitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
