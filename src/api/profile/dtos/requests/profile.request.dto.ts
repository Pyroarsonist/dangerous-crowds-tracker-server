import { IsDateString, IsNotEmpty } from 'class-validator';

export class ProfileRequestDto {
  @IsDateString()
  public readonly birthDate: string;

  @IsNotEmpty()
  public readonly name: string;
}
