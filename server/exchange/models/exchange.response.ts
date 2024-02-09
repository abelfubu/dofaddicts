import { Harvest } from '@prisma/client';

export interface ExchangeUser {
  picture?: string;
  nickname?: string;
  discord?: string;
  userHarvestId?: string;
  missing: Record<number, string[]>;
  repeated: Record<number, string[]>;
}

export interface ExchangeResponse {
  harvest: Record<string, Harvest>;
  users: ExchangeUser[];
}
