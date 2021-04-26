import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationsService } from 'api/locations/locations.service';

export class GetLocationsRequestDto {
  @Type(() => Number)
  @IsNumber()
  public readonly latitude: number;

  @Type(() => Number)
  @IsNumber()
  public readonly longitude: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(LocationsService.MAX_RADIUS)
  @Min(0)
  public readonly radius?: number;
}
