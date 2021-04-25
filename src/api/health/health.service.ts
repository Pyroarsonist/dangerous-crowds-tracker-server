import { Injectable } from '@nestjs/common';
import { UserHealthIndicatorModel } from 'common/database/models';
import { InjectModel } from '@nestjs/sequelize';
import { HealthResponseDto } from 'api/health/dtos';
import { HealthStatusEnum } from 'common/database/enums';

@Injectable()
export class HealthService {
  constructor(
    @InjectModel(UserHealthIndicatorModel)
    private readonly healthIndicatorModel: typeof UserHealthIndicatorModel,
  ) {}

  public async getHealth(userId: number): Promise<HealthResponseDto> {
    const user = await this.healthIndicatorModel.findByPk(userId);
    if (!user) {
      return { status: HealthStatusEnum.UNKNOWN };
    }
    return {
      status: user.status,
    };
  }

  public async updateHealth(
    userId: number,
    status: HealthStatusEnum,
  ): Promise<void> {
    const user = await this.healthIndicatorModel.findByPk(userId);
    if (!user) {
      await this.healthIndicatorModel.upsert({
        status,
        userId,
      });
      return;
    }
    user.status = status;

    await user.save();
  }
}
