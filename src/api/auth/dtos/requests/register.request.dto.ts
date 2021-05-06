import { IsDateString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { SexEnum } from 'common/database/enums';

export class RegisterRequestDto {
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  public readonly password: string;

  @IsDateString()
  public readonly birthDate: string;

  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  @IsEnum(SexEnum)
  public readonly sex: SexEnum;
}
