import { Harvest } from './harvest';

export interface HarvestUser {
  nickname: string;
  discord: string;
  server: string;
}

export interface HarvestDataResponse {
  harvest: Harvest[];
  harvestId: string;
  user: HarvestUser;
}
