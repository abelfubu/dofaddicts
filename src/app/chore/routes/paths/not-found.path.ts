import { Route } from '@angular/router';

export const notFoundPath: Route = {
  path: '**',
  redirectTo: '/es',
  pathMatch: 'full',
} as const;
