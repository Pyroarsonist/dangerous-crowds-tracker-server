import { CrowdStatusEnum } from 'api/locations/enums';

class LocationDto {
  public readonly distance: number;
  public readonly longitude: number;
  public readonly latitude: number;
  public readonly points: number;
}

export class GetLocationsResponseDto {
  public readonly points: number;
  public readonly status: CrowdStatusEnum;
  public readonly locations: LocationDto[];
  public readonly radius: number;
}
