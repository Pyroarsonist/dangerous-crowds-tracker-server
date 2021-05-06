import { UserLocationInterface } from './user-location.interface';
import { UserHealthIndicatorInterface } from './user-health-indicator.interface';
import { TimestampsInterface } from './timestamps.interface';
import { SexEnum } from 'common/database/enums';

export interface UserInterface extends TimestampsInterface {
  id?: number;

  name: string;

  birthDate: string;

  email: string;

  passwordHash: string;

  token: string;

  sex: SexEnum;

  location?: UserLocationInterface;

  status?: UserHealthIndicatorInterface;
}
