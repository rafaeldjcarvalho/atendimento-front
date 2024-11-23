import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassPrincipalComponent } from './class-principal.component';

describe('ClassPrincipalComponent', () => {
  let component: ClassPrincipalComponent;
  let fixture: ComponentFixture<ClassPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
