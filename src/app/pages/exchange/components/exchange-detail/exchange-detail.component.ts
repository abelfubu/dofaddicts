import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import { ExchangeStore } from '../../exchange.store';
import { ExchangeListHeaderComponent } from '../exchange-list-header/exchange-list-header.component';
import { ExchangeListItemComponent } from '../exchange-list-item/exchange-list-item.component';
import { ExchangeUserInfoComponent } from '../exchange-user-info/exchange-user-info.component';
import { UserExchangeCardComponent } from '../user-exchange-card/user-exchange-card.component';

@Component({
  selector: 'app-exchange-detail',
  standalone: true,
  imports: [
    TooltipModule,
    InputTextModule,
    TranslocoDirective,
    SelectButtonModule,
    ReactiveFormsModule,
    ExchangeUserInfoComponent,
    ExchangeListItemComponent,
    UserExchangeCardComponent,
    ExchangeListHeaderComponent,
  ],
  template: `
    <ng-container *transloco="let t">
      <div class="flex gap-3">
        <div class="col">
          <div class="w-6 m-auto my-3">
            <app-exchange-user-info [user]="store.targetUser()" />
          </div>
          <div class="flex justify-content-center my-3">
            <input
              #inputTarget
              type="text"
              pInputText
              (input)="store.searchTargetUser(inputTarget.value)"
              [placeholder]="t('home.search')"
              style="flex-basis: 500px"
            />
          </div>
          <div class="flex justify-content-center my-3">
            <p-selectButton
              [options]="[
                { name: t('home.monsters'), value: '0' },
                { name: t('home.bosses'), value: '1' },
                { name: t('home.archis'), value: '2' }
              ]"
              [formControl]="filtersTarget"
              [multiple]="true"
              optionLabel="name"
              optionValue="value"
            />
          </div>
        </div>
        <div class="col">
          <div class="w-6 m-auto my-3">
            <app-exchange-user-info [user]="store.sourceUser()" />
          </div>
          <div class="flex justify-content-center my-3">
            <input
              #inputCurrent
              type="text"
              pInputText
              (input)="store.searchCurrentUser(inputCurrent.value)"
              [placeholder]="t('home.search')"
              style="flex-basis: 500px"
            />
          </div>
          <div class="flex justify-content-center my-3">
            <p-selectButton
              [options]="[
                { name: t('home.monsters'), value: '0' },
                { name: t('home.bosses'), value: '1' },
                { name: t('home.archis'), value: '2' }
              ]"
              [formControl]="filtersCurrent"
              [multiple]="true"
              optionLabel="name"
              optionValue="value"
            />
          </div>
        </div>
      </div>
      <div class="flex gap-3 mb-8">
        <div class="col">
          <app-exchange-list-header />
          @for (item of store.targetUserItems(); track item.id) {
            <app-exchange-list-item [item]="item" />
          }
        </div>
        <div class="col">
          <app-exchange-list-header />
          @for (item of store.sourceUserItems(); track item.id) {
            <app-exchange-list-item [item]="item" />
          }
        </div>
      </div>
    </ng-container>
  `,
})
export class ExchangeDetailComponent {
  protected readonly store = inject(ExchangeStore);
  protected readonly transloco = inject(TranslocoService);
  nickname = input.required<string>();
  protected readonly filtersCurrent = new FormControl<string[]>([
    '0',
    '1',
    '2',
  ]);
  protected readonly filtersTarget = new FormControl<string[]>(['0', '1', '2']);

  ngOnInit(): void {
    this.store.with(this.nickname);
    this.store.filterMonsterTypeCurrent(
      this.filtersCurrent.valueChanges.pipe(map((v) => v || ['0', '1', '2'])),
    );
    this.store.filterMonsterTypeTarget(
      this.filtersTarget.valueChanges.pipe(map((v) => v || ['0', '1', '2'])),
    );
  }
}
