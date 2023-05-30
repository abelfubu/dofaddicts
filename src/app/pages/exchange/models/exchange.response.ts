import { Harvest } from '../../harvest/models/harvest';

export interface ExchangeResponse {
  discord: string;
  nickname: string;
  picture: string;
  userHarvestId: string;
  server: string;
  harvest: {
    his: Record<number, Harvest[]>;
    mine: Record<number, Harvest[]>;
  };
}
