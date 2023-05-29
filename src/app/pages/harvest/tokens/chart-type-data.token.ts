import { InjectionToken } from '@angular/core';
import { Harvest, HarvestType } from '../models/harvest';

export interface ChartItemData {
  callback: (item: Harvest) => boolean;
  label: string;
  colors: [string, string];
  amount: number;
}

export type ChartData = ChartItemData[];

export const CHART_TYPE_DATA = new InjectionToken<ChartData>('CHART_TYPE_DATA');

export const CHART_TYPE_PROVIDER = {
  provide: CHART_TYPE_DATA,
  useValue: [
    {
      callback: (item: Harvest) => item.captured && item.type === HarvestType.MONSTER,
      label: 'home.monsters',
      colors: ['#8E24AA', '#BA68C877'],
      amount: 299,
    },
    {
      callback: (item: Harvest) => item.captured && item.type === HarvestType.BOSS,
      label: 'home.bosses',
      colors: ['#00ACC1', '#4DD0E177'],
      amount: 51,
    },
    {
      callback: (item: Harvest) => item.captured && item.type === HarvestType.ARCHI,
      label: 'home.archis',
      colors: ['#C0CA33', '#DCE77577'],
      amount: 286,
    },
    {
      callback: (item: Harvest) => item.captured,
      label: 'home.total',
      colors: ['#FFB300', '#FFD54F77'],
      amount: 636,
    },
  ],
};
