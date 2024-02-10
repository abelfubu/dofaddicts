import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { filter } from 'rxjs';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { HarvestStore } from '../../../harvest.store';
import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HEADERS } from './header-data';

@Component({
  selector: 'app-harvest-table-header',
  templateUrl: './harvest-table-header.component.html',
  styleUrls: ['./harvest-table-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    TranslocoModule,
    MultiSelectModule,
    HarvestStepModalComponent,
  ],
})
export class HarvestTableHeaderComponent {
  readonly headers = HEADERS;

  private readonly dialog = inject(DialogService);
  protected readonly harvestStore = inject(HarvestStore);
  private readonly transloco = inject(TranslocoService);

  openFilter<T>(component: ComponentType<T>, steps: boolean[]) {
    this.dialog
      .open(component, {
        data: steps,
        header: this.transloco.translate('home.steps'),
      })
      .onClose.pipe(filter(Boolean))
      .subscribe((data) => this.harvestStore.filterBySteps(data));
  }
}
