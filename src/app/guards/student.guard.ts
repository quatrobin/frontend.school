import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const studentGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isStudent()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
}; 