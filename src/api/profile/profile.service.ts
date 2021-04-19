import { Injectable } from '@nestjs/common';
import { UserModel } from 'common/database/models';
import { InjectModel } from '@nestjs/sequelize';
import { ProfileResponseDto } from 'api/profile/dtos/responses';

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
    };
  }

  public async updateProfile(
    userId: number,
    name: string,
    birthDate: string,
  ): Promise<void> {
    const user = await this.userModel.findByPk(userId);

    user.name = name;
    user.birthDate = new Date(birthDate).toISOString();

    await user.save();
  }
}
