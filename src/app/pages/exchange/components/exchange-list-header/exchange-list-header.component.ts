import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-exchange-list-header',
  standalone: true,
  imports: [TranslocoDirective],
  template: `
    <ng-container *transloco="let t; read: 'home.table'">
      <div class="grid align-items-center">
        <div class="col-2"></div>
        <p class="col-8 text-primary-500 m-0">{{ t('name') }}</p>
        <p class="col-2 text-primary-500 m-0">{{ t('step') }}</p>
      </div>
    </ng-container>
  `,
})
export class ExchangeListHeaderComponent {}
