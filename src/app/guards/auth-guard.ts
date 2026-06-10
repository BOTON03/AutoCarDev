import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard = async (p0: RouterStateSnapshot | ActivatedRouteSnapshot) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router);
  
  const isLoggedIn = await authService.isLoggedIn();
  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};