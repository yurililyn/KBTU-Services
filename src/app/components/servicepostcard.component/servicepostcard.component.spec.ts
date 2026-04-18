import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicepostcardComponent } from './servicepostcard.component';

describe('ServicepostcardComponent', () => {
  let component: ServicepostcardComponent;
  let fixture: ComponentFixture<ServicepostcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicepostcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicepostcardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
