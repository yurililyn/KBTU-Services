import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercardrequestedComponent } from './ordercardrequested.component';

describe('OrdercardrequestedComponent', () => {
  let component: OrdercardrequestedComponent;
  let fixture: ComponentFixture<OrdercardrequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdercardrequestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdercardrequestedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
