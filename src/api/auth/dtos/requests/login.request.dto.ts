import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  public readonly password: string;
}
