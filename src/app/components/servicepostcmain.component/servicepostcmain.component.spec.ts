import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicepostcmainComponent } from './servicepostcmain.component';

describe('ServicepostcmainComponent', () => {
  let component: ServicepostcmainComponent;
  let fixture: ComponentFixture<ServicepostcmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicepostcmainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicepostcmainComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
