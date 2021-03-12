import { IsNumber } from 'class-validator';

export class SaveLocationRequestDto {
  @IsNumber()
  public readonly latitude: number;

  @IsNumber()
  public readonly longitude: number;
}
