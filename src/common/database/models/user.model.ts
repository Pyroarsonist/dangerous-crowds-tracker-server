import {
  Column,
  Model,
  Table,
  PrimaryKey,
  DataType,
  HasOne,
  AllowNull,
  Unique,
  AutoIncrement,
} from 'sequelize-typescript';
import { UserLocationModel } from './user-location.model';
import { UserHealthIndicatorModel } from './user-health-indicator.model';
import crypto from 'crypto';
import {
  UserHealthIndicatorInterface,
  UserInterface,
  UserLocationInterface,
} from 'common/database/interfaces';

@Table({ tableName: 'User' })
export class UserModel extends Model<UserInterface> {
  @PrimaryKey
  @Unique
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  name: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  birthDate: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(256))
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  passwordHash: string;

  @AllowNull(false)
  @Column(DataType.STRING(256))
  token: string;

  @HasOne(() => UserLocationModel)
  location: UserLocationInterface;

  @HasOne(() => UserHealthIndicatorModel)
  status: UserHealthIndicatorInterface;

  static makePasswordHash(password: string): string {
    return crypto
      .createHash('sha512')
      .update(password, 'utf-8')
      .digest('hex')
      .substring(0, 526);
  }

  static makeRandomToken(): string {
    return crypto.randomBytes(256).toString('hex').substring(0, 256);
  }
}
