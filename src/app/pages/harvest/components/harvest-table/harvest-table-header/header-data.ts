import { HarvestStepModalComponent } from '../../harvest-filters/harvest-step-modal/harvest-step-modal.component';

export const HEADERS = [
  {
    label: '',
    type: 'space',
  },
  {
    label: 'home.table.name',
    type: 'text',
  },
  {
    label: 'home.table.level',
    type: 'text',
  },
  {
    label: 'home.table.subzone',
    type: 'text',
  },
  {
    label: 'home.table.step',
    type: 'filter',
    component: HarvestStepModalComponent,
  },
  {
    label: 'home.table.captured',
    type: 'text',
  },
  {
    label: 'home.table.repeated',
    type: 'text',
  },
];
