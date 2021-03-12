import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  AllowNull,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import {
  PointInterface,
  UserInterface,
  UserLocationInterface,
} from 'common/database/interfaces';

@Table({ tableName: 'UserLocation' })
export class UserLocationModel extends Model<UserLocationInterface> {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Column(DataType.GEOMETRY('POINT'))
  point: PointInterface;

  @BelongsTo(() => UserModel)
  user: UserInterface;
}
