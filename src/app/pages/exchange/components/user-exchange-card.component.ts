import { NgOptimizedImage } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HarvestItemType } from '@models/harvest-item-type.enum';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoDirective } from '@ngneat/transloco';
import { from } from 'rxjs';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ExchangeUser } from '../models/exchange.response';
import { UserExchangeItemComponent } from './user-exchange-item/user-exchange-item.component';

@Component({
  selector: 'app-user-exchange-card',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    ButtonComponent,
    TranslocoDirective,
    UserExchangeItemComponent,
  ],
  template: `
    <div class="card" *transloco="let t">
      <div class="cell">
        <div class="title">
          <small>{{ t('exchange.name') }}</small>
          <h3 class="m-0">{{ user.nickname }}</h3>
        </div>
        <app-button (click)="$event.stopPropagation(); copyToClipboard()"
          ><span class="material-symbols-outlined">
            content_copy
          </span></app-button
        >
      </div>
      <div class="cell">
        <div class="title">
          <small>Discord ID</small>
          <h3 class="m-0">{{ user.discord || '-' }}</h3>
        </div>
      </div>

      <h3 class="m-0">
        {{ t('exchange.youCanGive', { name: user.nickname }) }}
      </h3>
      <div class="harvest-info">
        <app-user-exchange-item
          [amount]="user.missing[HarvestItemType.Monster].length"
          [type]="HarvestItemType.Monster"
        />

        <app-user-exchange-item
          [amount]="user.missing[HarvestItemType.Boss].length"
          [type]="HarvestItemType.Boss"
        />

        <app-user-exchange-item
          [amount]="user.missing[HarvestItemType.Archi].length"
          [type]="HarvestItemType.Archi"
        />
      </div>

      <h3 class="m-0">
        {{ t('exchange.heCanGive', { name: user.nickname }) }}
      </h3>
      <div class="harvest-info">
        <app-user-exchange-item
          [amount]="user.repeated[HarvestItemType.Monster].length"
          [type]="HarvestItemType.Monster"
        />

        <app-user-exchange-item
          [amount]="user.repeated[HarvestItemType.Boss].length"
          [type]="HarvestItemType.Boss"
        />

        <app-user-exchange-item
          [amount]="user.repeated[HarvestItemType.Archi].length"
          [type]="HarvestItemType.Archi"
        />
      </div>
    </div>
  `,
  styles: [
    `
      @use 'colors' as c;

      $primary: map-get(
        $map: c.$dark,
        $key: 300,
      );

      .card {
        box-shadow: 0 0 0 1px $primary;
        border-radius: 0.4rem;
        padding: 1rem 1rem 0;
        margin: 0 0 1rem;
        transition: box-shadow 0.2s ease-in-out;

        &:hover {
          box-shadow: 0 0 0 2px $primary;
        }
      }

      .harvest-info {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: repeat(3, 1fr);
        padding: 1rem 0;
      }

      .amount {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.4rem;
        width: 10rem;
        cursor: pointer;

        h3 {
          font-size: 2rem;
        }
      }

      .purple {
        background-color: rgba(map-get(c.$primary, 800), 0.4);
      }

      .blue {
        background-color: rgba(c.$medium-blue, 0.4);
      }

      .yellow {
        background-color: rgba(map-get(c.$primary, 600), 0.4);
      }

      .cell {
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      app-button {
        justify-self: end;
      }
    `,
  ],
})
export class UserExchangeCardComponent {
  @Input({ required: true }) user!: ExchangeUser;

  private readonly toast = inject(HotToastService);
  protected readonly HarvestItemType = HarvestItemType;

  copyToClipboard(): void {
    from(navigator.clipboard.writeText(`/w ${this.user.nickname} `))
      .pipe(
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Comando copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }
}
