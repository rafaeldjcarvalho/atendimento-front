import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { serviceResolver } from './service.resolver';

describe('serviceResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => serviceResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
