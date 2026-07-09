import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isLoggedIn } from '../helpers/token.helper';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
