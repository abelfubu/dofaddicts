import { InjectionToken } from '@angular/core';
import { DhMygoliaValidatorFn } from '@libs/da-mygolia/da-mygolia.dataset';
import { StringUtils } from '@libs/string';
import { Harvest, HarvestType } from '../models/harvest';
import { HarvestSteps } from '../models/harvest-steps';

export const HARVEST_FILTER = new InjectionToken<HarvestFilterI>(
  'HARVEST_FILTER'
);

export interface Filters extends Record<string, unknown> {
  showRepeatedOnly: boolean;
  showCaptured: boolean;
  search: string;
  steps: boolean[];
  monsters: boolean;
  bosses: boolean;
  archis: boolean;
}

export type FilterValidator = (item: Harvest, filters: Filters) => void | Error;

export interface HarvestFilterI {
  state: Filters;
  validators: DhMygoliaValidatorFn<Harvest>[];
}

const FILTER_VALUE: HarvestFilterI = {
  state: {
    showRepeatedOnly: false,
    showCaptured: true,
    search: '',
    steps: HarvestSteps.generate(34),
    monsters: true,
    bosses: true,
    archis: true,
  },
  validators: [
    (item, filters) => {
      if (filters['showRepeatedOnly'] && !item.amount) {
        throw new Error('Repeated Only');
      }
    },
    (item, filters) => {
      if (!filters['showCaptured'] && item.captured) {
        throw new Error('Show Captured');
      }
    },
    (item, filters) => {
      if (!(filters?.['steps'] as Record<number, unknown>)?.[item.step - 1]) {
        throw new Error('Steps');
      }
    },
    (item, filters) => {
      if (!filters['monsters'] && item.type === HarvestType.MONSTER) {
        throw new Error('Filter Monsters');
      }
    },
    (item, filters) => {
      if (!filters['bosses'] && item.type === HarvestType.BOSS) {
        throw new Error('Filter Bosses');
      }
    },
    (item, filters) => {
      if (!filters['archis'] && item.type === HarvestType.ARCHI) {
        throw new Error('Filter Archis');
      }
    },
    (item, filters) => {
      const { name, zone, subzone } = item;

      if (
        filters['search'] &&
        !Object.values({ name, zone, subzone })
          .map((value) => StringUtils.normalize(value))
          .some((value) =>
            value.includes(StringUtils.normalize(filters['search']! as string))
          )
      ) {
        throw new Error('Filter Search');
      }
    },
  ],
};

export const HARVEST_FILTER_PROVIDER = {
  provide: HARVEST_FILTER,
  useValue: FILTER_VALUE,
};
