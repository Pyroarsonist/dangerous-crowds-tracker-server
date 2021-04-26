import { CrowdStatusEnum } from 'api/locations/enums';

class LocationDto {
  public readonly latitude: number;
  public readonly longitude: number;
}

export class GetLocationsResponseDto {
  public readonly points: number;
  public readonly status: CrowdStatusEnum;
  public readonly locations: LocationDto[];
  public readonly radius: number;
}
