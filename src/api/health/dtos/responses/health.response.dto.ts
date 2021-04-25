import { IsEmail } from 'class-validator';
import { HealthStatusEnum } from 'common/database/enums';

export class HealthResponseDto {
  @IsEmail()
  public readonly status: HealthStatusEnum;
}
