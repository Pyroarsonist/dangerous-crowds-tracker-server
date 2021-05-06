import { Injectable } from '@nestjs/common';
import { UserModel } from 'common/database/models';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileResponseDto } from 'api/profile/dtos/responses';
import { SexEnum } from 'common/database/enums';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  public async getProfile(userId: number): Promise<ProfileResponseDto> {
    const user = await this.userModel.findByPk(userId);
    return {
      email: user.email,
      name: user.name,
      birthDate: new Date(user.birthDate).toISOString(),
      sex: user.sex,
    };
  }

  public async updateProfile(
    userId: number,
    name: string,
    birthDate: string,
    sex: SexEnum,
  ): Promise<void> {
    const user = await this.userModel.findByPk(userId);

    user.name = name;
    user.birthDate = new Date(birthDate).toISOString();
    user.sex = sex;

    await user.save();
  }
}
