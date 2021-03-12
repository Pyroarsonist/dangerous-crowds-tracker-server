import { TimestampsInterface } from 'common/database/interfaces/timestamps.interface';
import { PointInterface } from 'common/database/interfaces/point.interface';

export interface UserLocationInterface extends TimestampsInterface {
  userId: number;

  point: PointInterface;

  distance?: number;
}
