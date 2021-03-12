import { UserLocationInterface } from './user-location.interface';
import { UserHealthIndicatorInterface } from './user-health-indicator.interface';
import { TimestampsInterface } from './timestamps.interface';

export interface UserInterface extends TimestampsInterface {
  id?: number;

  name: string;

  birthDate: Date;

  email: string;

  passwordHash: string;

  token: string;

  location?: UserLocationInterface;

  status?: UserHealthIndicatorInterface;
}
