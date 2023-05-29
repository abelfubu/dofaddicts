import { Route } from '@angular/router';

export const sharePath: Route = {
  path: 'share/:id',
  loadComponent: () =>
    import('@pages/harvest/harvest.component').then((c) => c.HarvestComponent),
} as const;
