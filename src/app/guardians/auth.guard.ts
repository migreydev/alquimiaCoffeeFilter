import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanMatchFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('authGuard called');

  return authService.validateTokenLocalStorage().pipe(
    map(isValid => {
      console.log('Token is valid:', isValid);
      if (isValid) {
        return true;
      } else {
        Swal.fire({
          title: "Access Denied",
          text: "You do not have permission to access this page.",
          icon: "error",
          confirmButtonColor: "#FFC107"
        });
        return router.createUrlTree(['/auth/login']);
      }
    }),
    catchError(err => {
      console.error('CatchError:', err);
      Swal.fire({
        title: "Access Denied",
        text: "You do not have permission to access this page.",
        icon: "error",
        confirmButtonColor: "#FFC107"
      });
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};
