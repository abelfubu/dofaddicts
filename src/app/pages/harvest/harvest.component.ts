import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { Observable } from 'rxjs';
import { HeaderComponent } from 'src/app/shared/ui/header/header.component';
import { Link } from '../../shared/services/link.service';
import { HarvestFiltersComponent } from './components/harvest-filters/harvest-filters.component';
import { HarvestStepModalComponent } from './components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestTableComponent } from './components/harvest-table/harvest-table.component';
import { harvestSEOData } from './harvest.seo';
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
    HeaderComponent,
    NgxJsonLdModule,
    TranslocoModule,
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
    <ng-container *transloco="let t">
      <ngx-json-ld [json]="harvestSEOData.schema"></ngx-json-ld>
      <app-header (logout)="onLogout()" />
      <h1 class="m-0">{{ t('home.title') }}</h1>
      <app-harvest-filters (changed)="onSearchChange($event)" />
      <app-harvest-table
        [data]="data$ | async"
        (scrolled)="handleInfiniteScroll()"
      ></app-harvest-table>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        margin: auto;
        min-height: 80vh;

        h1 {
          visibility: hidden;
          height: 0;
        }
      }
    `,
  ],
})
export class HarvestComponent implements OnInit {
  protected readonly data$ = inject(HARVEST_DATA);
  protected readonly editable = inject(EDITABLE);
  private readonly route = inject(ActivatedRoute);
  private readonly harvestStore = inject(HarvestStore);
  protected readonly harvestSEOData = harvestSEOData;
  private readonly meta = inject(Meta);
  private readonly link = inject(Link);
  private readonly transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.harvestStore.getData(this.route.snapshot.params['id']);
    this.harvestSEOData.hrefLangs.forEach((link) => this.link.addLink(link));
    this.harvestSEOData.meta.forEach(({ name, content }) =>
      this.meta.updateTag({
        name,
        content: String(this.transloco.translate(content)),
      }),
    );
  }

  onSearchChange(search: string): void {
    this.harvestStore.search(search);
  }

  onLogout(): void {
    this.harvestStore.getData(this.route.snapshot.params['id']);
  }

  handleInfiniteScroll(): void {
    this.harvestStore.handleInfiniteScroll();
  }
}
