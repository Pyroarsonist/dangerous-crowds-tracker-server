import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { SexEnum } from 'common/database/enums';

export class ProfileRequestDto {
  @IsDateString()
  public readonly birthDate: string;

  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  @IsEnum(SexEnum)
  public readonly sex: SexEnum;
}
