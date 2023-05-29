import { NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { UserExchangeCardComponent } from './components/user-exchange-card.component';
import { ExchangeStore } from './exchange.store';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    HeaderComponent,
    TranslocoModule,
    ButtonComponent,
    UserExchangeCardComponent,
  ],
  providers: [ExchangeStore],
  template: `
    <ng-container *transloco="let t">
      <app-header />

      <ng-container *ngIf="!vm()?.error; else error">
        <h1 *ngIf="vm()?.users?.length">
          {{ t('exchange.title', { server: vm()?.users?.at(0)?.server }) }}
        </h1>

        <div class="card-container">
          <app-user-exchange-card *ngFor="let user of vm()?.users" [user]="user" />
        </div>
      </ng-container>

      <ng-template #error>
        <div class="error">
          <h1>{{ t('exchange.error.title') }}</h1>
          <p>{{ t('exchange.error.message') }}</p>
          <div class="actions">
            <app-button [routerLink]="['/', translate.getActiveLang(), 'profile']">{{
              t('exchange.error.button')
            }}</app-button>
            <app-button>{{ t('exchange.error.back') }}</app-button>
          </div>
        </div>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      @use 'colors' as c;

      :host {
        display: block;
        min-height: 100vh;
      }

      h1 {
        padding: 0 0 2rem;
      }

      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 1rem;
      }

      .error {
        box-shadow: 0 0 0 1px map-get($map: c.$dark, $key: 300);
        border-radius: 0.4rem;
        padding: 1.5rem 1rem 0.5rem;
        margin: 2rem 0;
      }

      .actions {
        display: flex;
        justify-content: flex-start;
        gap: 1rem;
        padding: 1.5rem 0 0.5rem;
      }
    `,
  ],
})
export class ExchangeComponent {
  private readonly store = inject(ExchangeStore);
  protected readonly translate = inject(TranslocoService);
  protected readonly vm = toSignal(this.store.vm$);

  ngOnInit(): void {
    this.store.getUsers();
  }
}
