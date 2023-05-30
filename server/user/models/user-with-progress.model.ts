import { User } from '@prisma/client';

export interface UserWithProgress extends User {
  userProgress: { id: string };
}
