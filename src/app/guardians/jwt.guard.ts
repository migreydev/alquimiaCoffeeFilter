import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../app/auth/services/auth.service';
import { tap } from 'rxjs';

export const jwtGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('jwtGuard')
  return authService.validateToken()
    .pipe(
      tap(valid => !valid? router.navigateByUrl('auth/login'): false)
    )
};