import {
  Column,
  Model,
  Table,
  ForeignKey,
  DataType,
  AllowNull,
  PrimaryKey,
} from 'sequelize-typescript';
import { UserModel } from './user.model';

@Table({ tableName: 'UserLocation' })
export class UserLocationModel extends Model<UserLocationModel> {
  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column(DataType.INTEGER)
  userId: number;

  @AllowNull(false)
  @Column(DataType.GEOMETRY('POINT'))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  point: any;
}
