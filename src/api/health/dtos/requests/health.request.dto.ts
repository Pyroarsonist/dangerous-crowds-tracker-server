import { IsEnum, IsNotEmpty } from 'class-validator';
import { HealthStatusEnum } from 'common/database/enums';

export class HealthRequestDto {
  @IsNotEmpty()
  @IsEnum(HealthStatusEnum)
  public readonly status: HealthStatusEnum;
}
