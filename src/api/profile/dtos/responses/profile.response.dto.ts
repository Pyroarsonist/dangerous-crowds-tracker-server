import { SexEnum } from 'common/database/enums';

export class ProfileResponseDto {
  public readonly email: string;

  public readonly birthDate: string;

  public readonly name: string;

  public readonly sex: SexEnum;
}
