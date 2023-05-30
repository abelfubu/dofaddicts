import { Harvest } from '@prisma/client';

export interface ExchangeResponse {
  picture: string | null;
  nickname: string;
  discord: string;
  server: string;
  userHarvestId: string;
  harvest: ExchangeHarvest;
}

export type ExchangeHarvest = {
  his: Record<number, Harvest[]>;
  mine: Record<number, Harvest[]>;
};
