export interface ExchangeUser {
  picture: string;
  nickname: string;
  discord: string;
  userHarvestId: string;
  serverId: string;
  server: string;
  missing: Record<number, string[]>;
  repeated: Record<number, string[]>;
}
