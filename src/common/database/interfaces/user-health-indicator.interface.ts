import { TimestampsInterface } from 'common/database/interfaces/timestamps.interface';

export interface UserHealthIndicatorInterface extends TimestampsInterface {
  userId: number;

  status: string;
}
