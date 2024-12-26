import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassUserListComponent } from './class-user-list.component';

describe('ClassUserListComponent', () => {
  let component: ClassUserListComponent;
  let fixture: ComponentFixture<ClassUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
