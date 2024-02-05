import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LazyImagesDirective } from '@shared/lazy-images.directive';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Harvest } from '../../models/harvest';
import { HarvestStepModalComponent } from '../harvest-filters/harvest-step-modal/harvest-step-modal.component';
import { HarvestItemComponent } from './harvest-item/harvest-item.component';
import { HarvestTableHeaderComponent } from './harvest-table-header/harvest-table-header.component';

@Component({
  selector: 'app-harvest-table',
  templateUrl: './harvest-table.component.html',
  styleUrls: ['./harvest-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatDialogModule,
    LazyImagesDirective,
    HarvestItemComponent,
    InfiniteScrollModule,
    HarvestTableHeaderComponent,
  ],
})
export class HarvestTableComponent {
  @Input() data!: Harvest[] | null;
  @Output() scrolled = new EventEmitter();

  private readonly matDialog = inject(MatDialog);

  openFilter() {
    this.matDialog.open(HarvestStepModalComponent, {
      panelClass: 'background',
    });
  }
}
