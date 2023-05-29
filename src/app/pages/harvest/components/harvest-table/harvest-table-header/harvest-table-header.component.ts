import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
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
  imports: [CommonModule, ButtonComponent, HarvestStepModalComponent, TranslocoModule],
})
export class HarvestTableHeaderComponent {
  readonly headers = HEADERS;

  private readonly matDialog = inject(MatDialog);
  private readonly harvestStore = inject(HarvestStore);

  readonly steps$ = this.harvestStore.steps$;

  openFilter<T>(component: ComponentType<T>, steps: boolean[]) {
    this.matDialog
      .open(component, { data: steps, panelClass: 'background' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((data) => this.harvestStore.steps(data));
  }
}
