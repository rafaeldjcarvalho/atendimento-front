import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultAppLayoutComponent } from './default-app-layout.component';

describe('DefaultAppLayoutComponent', () => {
  let component: DefaultAppLayoutComponent;
  let fixture: ComponentFixture<DefaultAppLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultAppLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultAppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
