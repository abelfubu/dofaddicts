import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { filter } from 'rxjs';
import { HarvestStore } from '../../../harvest.store';
import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HEADERS } from './header-data';

@Component({
  selector: 'app-harvest-table-header',
  styleUrls: ['./harvest-table-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TranslocoModule,
    MultiSelectModule,
    HarvestStepModalComponent,
  ],
  template: `
    <div class="header-container" *ngIf="harvestStore.steps$ | async as steps">
      @for (header of headers; track header.label) {
        <div class="table-header">
          <ng-container [ngSwitch]="header.type" *transloco="let t">
            <div *ngSwitchCase="'space'"></div>
            <p-button
              *ngSwitchCase="'text'"
              [text]="true"
              [label]="t(header.label)"
            />
            <p-button
              [outlined]="steps.includes(false)"
              [text]="!steps.includes(false)"
              *ngSwitchCase="'filter'"
              icon="pi pi-chevron-down"
              (click)="openFilter(header.component!, steps)"
              [label]="t(header.label)"
            />
          </ng-container>
        </div>
      }
    </div>
  `,
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
