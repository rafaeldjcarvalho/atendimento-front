import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isLoggedGuard } from './is-logged.guard';

describe('isLoggedGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isLoggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
