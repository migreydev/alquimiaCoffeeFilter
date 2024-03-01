import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../auth/services/auth.service';

// Guardian que controla el acceso basado en la autenticacion y el rol del usuario
export const authRoleGuard: CanMatchFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario esta autenticado y obtiene el rol
  const isLoggedIn = authService.isLoggedIn();
  const userRole = authService.getUserRole();


  if (isLoggedIn && (userRole === 'admin' || userRole === 'user')) {
    return true;
  } else if (isLoggedIn && userRole !== 'admin') {
    Swal.fire({
      title: "Access Denied",
      text: "You do not have permission to access this page.",
      icon: "error",
      confirmButtonColor: "#FFC107"
    });
    return router.createUrlTree(['/']);
  } else {
    Swal.fire({
      title: "Not Authenticated",
      text: "Please log in to access this page",
      icon: "info",
      confirmButtonColor: "#FFC107"
    });
    return router.createUrlTree(['/auth/login']);
  }
};
