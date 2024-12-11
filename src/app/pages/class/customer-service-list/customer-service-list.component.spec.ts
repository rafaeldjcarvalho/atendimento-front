import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceListComponent } from './customer-service-list.component';

describe('CustomerServiceListComponent', () => {
  let component: CustomerServiceListComponent;
  let fixture: ComponentFixture<CustomerServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
