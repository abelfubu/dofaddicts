import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

export const harvestPath: Route = {
  path: '',
  title: () => {
    const transloco = inject(TranslocoService);
    return `Dofaddicts | ${transloco.translate('home.title')}`;
  },
  loadComponent: () =>
    import('@pages/harvest/harvest.component').then((c) => c.HarvestComponent),
} as const;
