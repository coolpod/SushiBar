import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushiBarComponent } from './sushi-bar.component';

describe('SushiBarComponent', () => {
  let component: SushiBarComponent;
  let fixture: ComponentFixture<SushiBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SushiBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SushiBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
