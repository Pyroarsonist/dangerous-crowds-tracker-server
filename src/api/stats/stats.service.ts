import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CoronavirusService } from 'common/coronavirus/coronavirus.service';
import { StatsDay, StatsResponseDto } from 'api/stats/dtos';
import { CoronavirusDayInterface } from 'common/coronavirus/interfaces';

@Injectable()
export class StatsService {
  constructor(private readonly coronavirusService: CoronavirusService) {}

  private static dayMapper = (day: CoronavirusDayInterface): StatsDay => ({
    active: day.Active,
    confirmed: day.Confirmed,
    id: day.ID,
    date: day.Date,
    deaths: day.Deaths,
    recovered: day.Recovered,
  });

  public async getStats(): Promise<StatsResponseDto> {
    const data = await this.coronavirusService.getSnapshot();
    if (!data) {
      throw new InternalServerErrorException('No data');
    }
    return {
      days: data.map((d) => StatsService.dayMapper(d)),
    };
  }
}
