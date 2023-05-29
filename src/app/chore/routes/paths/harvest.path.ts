import { Route } from '@angular/router';

export const harvestPath: Route = {
  path: '',
  loadComponent: () =>
    import('@pages/harvest/harvest.component').then((c) => c.HarvestComponent),
} as const;
