import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { AdminUsers } from './features/users/admin-users/admin-users';
import { AuthService } from './core/services/auth';

const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (user?.role === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'admin/users',
    component: AdminUsers,
    canActivate: [adminGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];