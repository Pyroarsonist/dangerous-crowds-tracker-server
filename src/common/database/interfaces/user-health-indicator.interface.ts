import { TimestampsInterface } from 'common/database/interfaces/timestamps.interface';
import { HealthStatusEnum } from 'common/database/enums';

export interface UserHealthIndicatorInterface extends TimestampsInterface {
  userId: number;

  status: HealthStatusEnum;
}
