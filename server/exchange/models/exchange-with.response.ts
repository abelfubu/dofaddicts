import { Harvest } from '@prisma/client';

interface ExchangeWithUser {
  picture: string;
  nickname: string;
  discord: string;
  userHarvestId: string;
  serverId: string;
  server: string;
  missing: string[];
  repeated: Harvest[];
}

export interface ExchangeWithResponse {
  currentUser: ExchangeWithUser;
  targetUser: ExchangeWithUser;
}
