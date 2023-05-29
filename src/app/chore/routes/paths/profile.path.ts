import { Route } from '@angular/router';

export const profilePath: Route = {
  path: 'profile',
  loadComponent: () =>
    import('@pages/profile/profile.component').then((c) => c.ProfileComponent),
} as const;
