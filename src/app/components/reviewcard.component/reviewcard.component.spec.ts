import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewcardComponent } from './reviewcard.component';

describe('ReviewcardComponent', () => {
  let component: ReviewcardComponent;
  let fixture: ComponentFixture<ReviewcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewcardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
