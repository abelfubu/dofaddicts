import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { HarvestStepModalComponent } from '@pages/harvest/components/harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { ChartComponent } from '@shared/chart/chart.component';
import { ChartSlice } from '@shared/chart/chart.model';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { DialogService } from 'primeng/dynamicdialog';
import {
  combineLatest,
  debounceTime,
  filter,
  first,
  from,
  map,
  Observable,
  switchMap,
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
    CommonModule,
    ReactiveFormsModule,
    ChartComponent,
    InputComponent,
    ButtonComponent,
    RouterLinkWithHref,
    HarvestStepModalComponent,
    TranslocoModule,
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
  search = new FormControl('');

  @Output() changed = this.search.valueChanges.pipe(
    debounceTime(400),
    map(String),
  );

  private readonly toast = inject(HotToastService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly harvestStore = inject(HarvestStore);
  private readonly dialog = inject(DialogService);
  private readonly translate = inject(TranslocoService);
  private readonly route = inject(ActivatedRoute);
  private readonly globalStore = inject(GlobalStore);

  protected readonly vm$ = inject(HARVEST_FILTERS_VM);
  protected readonly isShared = this.route.snapshot.params['id'];

  form = this.formBuilder.nonNullable.group({
    showCaptured: [true],
    showRepeatedOnly: [false],
    monsters: [true],
    bosses: [true],
    archis: [true],
  });

  ngOnInit(): void {
    this.harvestStore.filter(this.form.valueChanges);

    if (!this.route.snapshot.queryParamMap.has('selection')) return;

    const selection = this.route.snapshot.queryParamMap.get('selection');

    this.form.setValue({
      showCaptured: true,
      showRepeatedOnly: true,
      monsters: selection === HarvestSelection.MONSTERS,
      bosses: selection === HarvestSelection.BOSSES,
      archis: selection === HarvestSelection.ARCHIS,
    });
  }

  onClearFilters(): void {
    this.form.setValue(DEFAULT_FILTERS);
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
