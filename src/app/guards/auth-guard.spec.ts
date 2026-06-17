import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard = (...guardParameters: any[]) => 
      TestBed.runInInjectionContext(() => authGuard(guardParameters[0]));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
