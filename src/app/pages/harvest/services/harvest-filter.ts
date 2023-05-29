import { inject, Injectable } from '@angular/core';
import { Harvest } from '../models/harvest';
import { Filters, HARVEST_FILTER } from '../tokens/harvest-filter.token';

@Injectable()
export class HarvestFilter {
  readonly harvestFilter = inject(HARVEST_FILTER);

  applyFilters(item: Harvest, filters: Filters): void {
    this.harvestFilter.validators.forEach((validator) => validator(item, filters));
  }
}
