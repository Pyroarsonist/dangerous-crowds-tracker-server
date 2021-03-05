import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  public readonly password: string;

  @IsDateString()
  public readonly birthDate: string;

  @IsNotEmpty()
  public readonly name: string;
}
