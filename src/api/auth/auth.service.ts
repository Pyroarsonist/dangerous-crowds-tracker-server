import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserModel } from 'common/database/models';
import { InjectModel } from '@nestjs/sequelize';
import { SexEnum } from 'common/database/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  private async findUser(email: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    if (user.passwordHash !== UserModel.makePasswordHash(password)) {
      return null;
    }
    user.token = UserModel.makeRandomToken();
    await user.save();
    return user.token;
  }

  public async login(email: string, password: string): Promise<string> {
    const token = await this.findUser(email, password);
    if (!token) {
      throw new UnauthorizedException('Access denied');
    }
    return token;
  }

  public async register(
    email: string,
    password: string,
    name: string,
    birthDate: string,
    sex: SexEnum,
  ): Promise<string> {
    const oldUser = await this.userModel.findOne({ where: { email } });
    if (oldUser) {
      throw new ConflictException('User already exists');
    }
    const passwordHash = UserModel.makePasswordHash(password);

    const user = await this.userModel.create({
      email,
      passwordHash,
      name,
      birthDate: new Date(birthDate).toISOString(),
      token: UserModel.makeRandomToken(),
      sex,
    });

    return user.token;
  }
}
