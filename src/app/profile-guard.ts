import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
export const profileGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if(auth.isLoggedIn()){
    console.log(auth.getToken())
    return router.createUrlTree(['/profile']);
  }
  return true;
};