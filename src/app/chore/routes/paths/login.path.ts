import { Route } from '@angular/router';

export const loginPath: Route = {
  path: 'login',
  loadComponent: () =>
    import('@pages/login/login.component').then((c) => c.LoginComponent),
} as const;
