import { User } from '@shared/models/user';

export interface ProfileDataResponse {
  profile: User;
  servers: Server[];
}

interface Server {
  id: string;
  name: string;
  type: number;
}
