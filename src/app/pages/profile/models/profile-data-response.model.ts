import { User } from '@shared/models/user';

export interface ProfileDataResponse {
  profile: User;
  servers: any[];
}
