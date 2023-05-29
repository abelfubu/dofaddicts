import { AuthProvider } from './auth-provider';

export interface Credentials {
  provider: AuthProvider;
  credential?: string;
  email?: string;
  password?: string;
}
