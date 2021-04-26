import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'common/guards/auth.guard';
import { LocationsService } from 'api/locations/locations.service';
import {
  GetLocationsRequestDto,
  SaveLocationRequestDto,
} from 'api/locations/dtos/requests';
import { GetUser } from 'common/decorators/current-user.decorator';
import { GetLocationsResponseDto } from 'api/locations/dtos/responses';

@UseGuards(AuthGuard)
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  public async getLocations(
    @Query() { latitude, longitude, radius }: GetLocationsRequestDto,
    @GetUser('id') id: number,
  ): Promise<GetLocationsResponseDto> {
    return this.locationsService.getLocations(id, latitude, longitude, radius);
  }

  @Post()
  public async saveLocation(
    @Body() { latitude, longitude }: SaveLocationRequestDto,
    @GetUser('id') id: number,
  ): Promise<void> {
    await this.locationsService.saveLocation(id, latitude, longitude);
  }
}
