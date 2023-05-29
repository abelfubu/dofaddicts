import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalStore } from 'src/app/shared/store/global.store';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { HarvestFiltersComponent } from './components/harvest-filters/harvest-filters.component';
import { HarvestStepModalComponent } from './components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestTableComponent } from './components/harvest-table/harvest-table.component';
import { HarvestStore } from './harvest.store';
import { Harvest } from './models/harvest';
import { HarvestFilter } from './services/harvest-filter';
import { CHART_TYPE_PROVIDER } from './tokens/chart-type-data.token';
import { HARVEST_FILTER_PROVIDER } from './tokens/harvest-filter.token';

const HARVEST_DATA = new InjectionToken<Observable<Harvest[]>>('HARVEST_DATA');
export const EDITABLE = new InjectionToken<Observable<boolean>>('EDITABLE');

@Component({
  selector: 'app-havest',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    HeaderComponent,
    HarvestTableComponent,
    HarvestFiltersComponent,
    HarvestStepModalComponent,
  ],
  providers: [
    HARVEST_FILTER_PROVIDER,
    CHART_TYPE_PROVIDER,
    HarvestFilter,
    HarvestStore,
    {
      provide: HARVEST_DATA,
      useFactory: () => inject(HarvestStore).harvest$,
    },
    {
      provide: EDITABLE,
      useFactory: () => !inject(ActivatedRoute).snapshot.params['id'],
    },
  ],
  template: `
    <app-header (logout)="onLogout()" />
    <app-harvest-filters (changed)="onSearchChange($event)" />
    <app-harvest-table
      [data]="data$ | async"
      (scrolled)="handleInfiniteScroll()"
    ></app-harvest-table>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: auto;
        min-height: 80vh;
      }
    `,
  ],
})
export class HarvestComponent implements OnInit {
  protected readonly data$ = inject(HARVEST_DATA);
  protected readonly editable = inject(EDITABLE);
  private readonly route = inject(ActivatedRoute);
  private readonly globalStore = inject(GlobalStore);
  private readonly harvestStore = inject(HarvestStore);

  ngOnInit(): void {
    this.harvestStore.getData(this.route.snapshot.params['id']);
  }

  onSearchChange(search: string): void {
    this.harvestStore.search(search);
  }

  onLogout(): void {
    this.globalStore.logout();
    this.harvestStore.getData(this.route.snapshot.params['id']);
  }

  handleInfiniteScroll(): void {
    this.harvestStore.handleInfiniteScroll();
  }
}
