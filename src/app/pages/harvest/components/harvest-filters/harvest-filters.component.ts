import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { HarvestStepModalComponent } from '@pages/harvest/components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { ChartComponent } from '@shared/chart/chart.component';
import { ChartSlice } from '@shared/chart/chart.model';
import { InputComponent } from '@shared/ui/input/input.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  combineLatest,
  debounceTime,
  filter,
  first,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GlobalStore } from '../../../../shared/store/global.store';
import { HarvestStore } from '../../harvest.store';
import { HarvestUser } from '../../models/harvest-data.response';
import { DEFAULT_FILTERS } from './filters-data';

export const enum HarvestSelection {
  MONSTERS = 'monsters',
  BOSSES = 'bosses',
  ARCHIS = 'archis',
}

export const HARVEST_FILTERS_VM = new InjectionToken<
  Observable<HarvestFiltersVM>
>('HARVEST_FILTERS_VM');

interface HarvestFiltersVM {
  statistics: ChartSlice[][];
  harvestId: string;
  steps: boolean[];
  user: HarvestUser;
}

@Component({
  selector: 'app-harvest-filters',
  templateUrl: './harvest-filters.component.html',
  styleUrls: ['./harvest-filters.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CommonModule,
    ChartComponent,
    InputComponent,
    CheckboxModule,
    InputTextModule,
    TranslocoDirective,
    RouterLinkWithHref,
    SelectButtonModule,
    ReactiveFormsModule,
    HarvestStepModalComponent,
  ],
  providers: [
    {
      provide: HARVEST_FILTERS_VM,
      useFactory: () => {
        const store = inject(HarvestStore);
        return combineLatest([
          store.statistics$,
          store.harvestId$,
          store.steps$,
          store.harvestUser$,
        ]).pipe(
          map(([statistics, harvestId, steps, user]) => ({
            statistics,
            harvestId,
            steps,
            user,
          })),
        );
      },
    },
  ],
})
export class HarvestFiltersComponent {
  value = '';
  search = new FormControl('');
  filters = new FormControl(['showCaptured', 'monsters', 'bosses', 'archis']);

  @Output() changed = this.search.valueChanges.pipe(
    debounceTime(400),
    map(String),
  );

  private readonly toast = inject(HotToastService);
  private readonly router = inject(Router);
  private readonly harvestStore = inject(HarvestStore);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);
  private readonly globalStore = inject(GlobalStore);

  protected readonly vm$ = inject(HARVEST_FILTERS_VM);
  protected readonly isShared = this.route.snapshot.params['id'];

  ngOnInit(): void {
    this.harvestStore.filter(
      this.filters.valueChanges.pipe(
        map((value) => ({
          showCaptured: value?.includes('showCaptured'),
          showRepeatedOnly: value?.includes('showRepeatedOnly'),
          monsters: value?.includes('monsters'),
          bosses: value?.includes('bosses'),
          archis: value?.includes('archis'),
        })),
        tap(console.log),
      ),
    );

    if (!this.route.snapshot.queryParamMap.has('selection')) return;

    const selection = this.route.snapshot.queryParamMap.get('selection');

    this.filters.setValue(
      ['showCaptured', 'showRepeatedOnly'].concat(selection!),
    );
  }

  onClearFilters(): void {
    this.filters.setValue(DEFAULT_FILTERS);
    this.search.setValue('');
  }

  onBack(): void {
    this.router.navigate(['/', this.translate.getActiveLang()]);
  }

  onShareHarvest(id: string) {
    this.globalStore.user$
      .pipe(
        first(),
        switchMap((user) =>
          from(
            navigator.clipboard.writeText(
              `${environment.baseUrl}/${this.translate.getActiveLang()}/share/${
                user.nickname?.toLowerCase() ?? id
              }`,
            ),
          ),
        ),
      )
      .pipe(
        this.toast.observe({
          loading: 'Copiando url en el portapapeles',
          success: 'Enlace copiado en el portapapeles',
          error: 'Algo ha ido mal, intentalo más tarde',
        }),
      )
      .subscribe();
  }

  onStepCompleted(steps: boolean[]): void {
    this.harvestStore.completeSteps(
      this.dialog
        .open(HarvestStepModalComponent, {
          data: steps,
          header: this.translate.translate('home.steps'),
        })
        .onClose.pipe(filter(Boolean)),
    );
  }

  copyToClipboard(nickname: string): void {
    from(navigator.clipboard.writeText(`/w ${nickname} `))
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
