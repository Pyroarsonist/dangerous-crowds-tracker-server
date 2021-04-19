import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class ProfileResponseDto {
  @IsEmail()
  public readonly email: string;

  @IsDateString()
  public readonly birthDate: string;

  @IsNotEmpty()
  public readonly name: string;
}
