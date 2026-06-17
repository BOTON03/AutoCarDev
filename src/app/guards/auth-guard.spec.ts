import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth';
import { StorageService } from '../services/storage';

describe('authGuard', () => {
  const executeGuard = () =>
    TestBed.runInInjectionContext(() => authGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, StorageService, provideRouter([])]
    });
  });

  it('should redirect to login when user is not authenticated', async () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    const result = await executeGuard();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
