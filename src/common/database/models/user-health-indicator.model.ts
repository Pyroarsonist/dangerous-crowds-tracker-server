import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  AllowNull,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { UserHealthIndicatorInterface } from 'common/database/interfaces';
import { HealthStatusEnum } from 'common/database/enums';

@Table({ tableName: 'UserHealthIndicator' })
export class UserHealthIndicatorModel extends Model<UserHealthIndicatorInterface> {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Default(HealthStatusEnum.UNKNOWN)
  @Column(DataType.ENUM('unknown', 'infected', 'recovered', 'vaccinated'))
  status: HealthStatusEnum;
}
