import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLocationsRequestDto {
  @Type(() => Number)
  @IsNumber()
  public readonly latitude: number;

  @Type(() => Number)
  @IsNumber()
  public readonly longitude: number;
}
