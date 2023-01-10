import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCustomerDialogComponent } from './remove-customer-dialog.component';

describe('RemoveCustomerDialogComponent', () => {
  let component: RemoveCustomerDialogComponent;
  let fixture: ComponentFixture<RemoveCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveCustomerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
