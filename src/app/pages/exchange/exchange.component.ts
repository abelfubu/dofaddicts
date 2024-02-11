import { NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GlobalStore } from '../../shared/store/global.store';
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
    FormsModule,
    ButtonModule,
    DropdownModule,
    HeaderComponent,
    InputTextModule,
    TranslocoModule,
    UserExchangeCardComponent,
  ],
  template: `
    <ng-container *transloco="let t">
      <app-header />

      <div class="flex justify-content-center pb-5 pt-3 gap-2">
        <input
          #input
          type="text"
          pInputText
          (input)="store.search(input.value)"
          [placeholder]="t('home.search')"
          style="flex-basis: 500px"
        />

        <p-dropdown
          [options]="store.serverOptions()"
          [ngModel]="store.currentServer()"
          (onChange)="store.getUsers($event.value)"
          optionValue="id"
          optionLabel="name"
        />
      </div>

      <ng-container *ngIf="!store.error(); else error">
        <div class="card-container">
          @for (user of store.users(); track user.nickname) {
            <app-user-exchange-card
              [user]="user"
              [userName]="global.user()?.nickname || ''"
            />
          }
        </div>
      </ng-container>

      <ng-template #error>
        <div class="error">
          <h1>{{ t('exchange.error.title') }}</h1>
          <p>{{ t('exchange.error.message') }}</p>
          <div class="actions">
            <p-button
              [outlined]="true"
              [routerLink]="['/', translate.getActiveLang(), 'profile']"
              [label]="t('exchange.error.button')"
            />
            <p-button [outlined]="true" [label]="t('exchange.error.back')" />
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
        padding-bottom: 5rem;
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
  protected readonly store = inject(ExchangeStore);
  protected readonly global = inject(GlobalStore);
  protected readonly translate = inject(TranslocoService);

  ngOnInit(): void {
    this.store.getUsers('user');
  }
}
