import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HarvestItemType } from '@models/harvest-item-type.enum';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-exchange-item',
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
  template: `
    <ng-container *transloco="let t">
      <small class="text-center py-1 block">{{ t(monsterLabel()) }}</small>
      <div
        class="border-1 border-primary-500 border-circle square flex justify-content-center align-items-center bg-primary-700 m-2 hover:bg-primary-600 transition-colors transition-duration-100"
        [routerLink]="['/', transloco.getActiveLang(), 'share', nickname()]"
        [queryParams]="{ selection: monsterType() }"
      >
        <h3 class="p-1 m-0 text-gray-900 text-3xl">{{ amount() }}</h3>
      </div>
    </ng-container>
  `,
  styles: `
    .square {
      aspect-ratio: 4/4;
    }
  `,
})
export class UserExchangeItemComponent {
  type = input.required<HarvestItemType>();
  amount = input.required<number>();
  nickname = input.required<string>();

  protected readonly transloco = inject(TranslocoService);

  labelMap = {
    [HarvestItemType.Monster]: 'home.monsters',
    [HarvestItemType.Boss]: 'home.bosses',
    [HarvestItemType.Archi]: 'home.archis',
    [HarvestItemType.Total]: '-',
  };

  typeMap = {
    [HarvestItemType.Monster]: 'monsters',
    [HarvestItemType.Boss]: 'bosses',
    [HarvestItemType.Archi]: 'archis',
    [HarvestItemType.Total]: 'total',
  };

  monsterLabel = computed(() => this.labelMap[this.type()]);
  monsterType = computed(() => this.typeMap[this.type()]);
}
