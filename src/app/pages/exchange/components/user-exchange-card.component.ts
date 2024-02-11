import { Component, ViewEncapsulation, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HarvestItemType } from '@models/harvest-item-type.enum';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { TooltipModule } from 'primeng/tooltip';
import { from } from 'rxjs';
import { ExchangeStore } from '../exchange.store';
import { ExchangeUser } from '../models/exchange.response';
import { UserExchangeItemComponent } from './user-exchange-item/user-exchange-item.component';

@Component({
  selector: 'app-user-exchange-card',
  standalone: true,
  imports: [
    RouterLink,
    TranslocoDirective,
    UserExchangeItemComponent,
    TooltipModule,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *transloco="let t; read: 'exchange'">
      <div
        class="border-1 border-round border-primary-900 p-3 cursor-pointer hover:bg-primary-900 transition-color transition-duration-100"
        [routerLink]="[
          '/',
          transloco.getActiveLang(),
          'share',
          user().nickname
        ]"
      >
        <div class="flex justify-content-between align-items-center">
          <h2
            pTooltip="/w {{ user().nickname }}"
            tooltipStyleClass="tooltip"
            class="m-0 text-white cursor-pointer hover:text-primary-600 inline"
            (click)="copyToClipboard(); $event.stopPropagation()"
          >
            {{ user().nickname }}
          </h2>
          <small class="text-primary-400 text-bold">{{
            store.servers()[user().serverId].name
          }}</small>
        </div>
        <small class="block">Discord</small>
        <p class="m-0 text-primary-400">{{ user().discord || '-' }}</p>
        <div class="grid mt-3">
          <app-user-exchange-item
            class="col"
            [amount]="user().repeated[HarvestItemType.Monster].length"
            [type]="HarvestItemType.Monster"
            [nickname]="user().nickname"
          />
          <app-user-exchange-item
            class="col"
            [amount]="user().repeated[HarvestItemType.Boss].length"
            [type]="HarvestItemType.Boss"
            [nickname]="user().nickname"
          />
          <app-user-exchange-item
            class="col"
            [amount]="user().repeated[HarvestItemType.Archi].length"
            [type]="HarvestItemType.Archi"
            [nickname]="user().nickname"
          />
        </div>
        <!-- <h3 class="block text-center mt-0">{{ user().nickname }}</h3> -->
        <i
          class="pi pi-sort-alt text-center text-white text-3xl block mt-3"
        ></i>
        <h3 class="block text-center mb-0">{{ userName() }}</h3>
        <div class="grid">
          <app-user-exchange-item
            class="col"
            [amount]="user().missing[HarvestItemType.Monster].length"
            [type]="HarvestItemType.Monster"
            [nickname]="user().nickname"
          />
          <app-user-exchange-item
            class="col"
            [amount]="user().missing[HarvestItemType.Boss].length"
            [type]="HarvestItemType.Boss"
            [nickname]="user().nickname"
          />
          <app-user-exchange-item
            class="col"
            [amount]="user().missing[HarvestItemType.Archi].length"
            [type]="HarvestItemType.Archi"
            [nickname]="user().nickname"
          />
        </div>
      </div>
    </ng-container>
  `,
  styles: `
    .p-tooltip .p-tooltip-text {
      background: var(--surface-50);
      color: var(--primary-200);
    }
  `,
})
export class UserExchangeCardComponent {
  user = input.required<ExchangeUser>();
  userName = input.required<string>();

  private readonly toast = inject(HotToastService);
  protected readonly HarvestItemType = HarvestItemType;
  protected readonly store = inject(ExchangeStore);
  protected readonly transloco = inject(TranslocoService);

  copyToClipboard(): void {
    from(navigator.clipboard.writeText(`/w ${this.user().nickname} `))
      .pipe(
        // 11/02/2024
        // TODO: translate this
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Comando copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }
}
