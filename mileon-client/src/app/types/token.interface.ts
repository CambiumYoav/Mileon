import { User } from './user';

export interface DecodedToken extends User{
  active: boolean;
  exp: number; // Token expiration timestamp
}
