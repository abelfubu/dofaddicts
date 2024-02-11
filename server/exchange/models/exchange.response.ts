import { Server } from '@prisma/client';
import { ExchangeUser } from './exchante-user.model';

export interface ExchangeResponse {
  servers: Record<string, Server>;
  currentServer: string;
  users: ExchangeUser[];
}
