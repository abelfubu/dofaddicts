import { Server } from '@prisma/client';

export interface ExchangeUser {
  picture?: string;
  nickname?: string;
  discord?: string;
  userHarvestId?: string;
  serverId?: string;
  missing: Record<number, string[]>;
  repeated: Record<number, string[]>;
}

export interface ExchangeResponse {
  servers: Record<string, Server>;
  currentServer: string;
  users: ExchangeUser[];
}
