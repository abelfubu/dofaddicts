import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LazyImagesDirective } from '@shared/lazy-images.directive';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Harvest } from '../../models/harvest';
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
    LazyImagesDirective,
    HarvestItemComponent,
    InfiniteScrollModule,
    HarvestTableHeaderComponent,
  ],
})
export class HarvestTableComponent {
  @Input() data!: Harvest[] | null;
  @Output() scrolled = new EventEmitter();
}
