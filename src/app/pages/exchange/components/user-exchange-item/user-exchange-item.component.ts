import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HarvestItemType } from '@models/harvest-item-type.enum';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'app-user-exchange-item',
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
  template: `
    <ng-container *transloco="let t">
      <div class="cell" [class]="color()">
        <div class="title">
          <small>{{ t(monsterType()) }}</small>
        </div>
        <h3 class="m-2">{{ amount() }}</h3>
      </div>
    </ng-container>
  `,
  styleUrl: './user-exchange-item.component.scss',
})
export class UserExchangeItemComponent {
  type = input.required<HarvestItemType>();
  amount = input.required<number>();

  typeMap = {
    [HarvestItemType.Monster]: 'home.monsters',
    [HarvestItemType.Boss]: 'home.bosses',
    [HarvestItemType.Archi]: 'home.archis',
    [HarvestItemType.Total]: '-',
  };

  monsterType = computed(() => this.typeMap[this.type()]);

  colorMap = {
    [HarvestItemType.Monster]: 'purple',
    [HarvestItemType.Boss]: 'blue',
    [HarvestItemType.Archi]: 'yellow',
    [HarvestItemType.Total]: 'white',
  };

  color = computed(() => this.colorMap[this.type()]);
}
