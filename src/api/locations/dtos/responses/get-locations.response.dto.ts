import { StatusEnum } from 'api/locations/enums';

class LocationDto {
  public readonly latitude: number;
  public readonly longitude: number;
}

export class GetLocationsResponseDto {
  public readonly status: StatusEnum;
  public readonly locations: LocationDto[];
  public readonly radius: number;
}
