import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from 'common/guards/auth.guard';
import { StatsResponseDto } from 'api/stats/dtos';

@Controller('stats')
@UseGuards(AuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  public getStats(): Promise<StatsResponseDto> {
    return this.statsService.getStats();
  }
}
