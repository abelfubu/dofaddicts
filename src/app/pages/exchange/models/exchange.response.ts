import { Harvest } from '../../harvest/models/harvest';

export interface ExchangeResponse {
  discord: string;
  nickname: string;
  picture: string;
  userHarvestId: string;
  server: string;
  harvest: {
    0: Harvest[];
    1: Harvest[];
    2: Harvest[];
  };
}
