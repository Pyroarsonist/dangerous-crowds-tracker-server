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

@Table({ tableName: 'UserHealthIndicator' })
export class UserHealthIndicatorModel extends Model<UserHealthIndicatorModel> {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Default('unknown')
  @Column(DataType.ENUM('unknown', 'infected', 'recovered', 'vaccinated'))
  status: string;
}
