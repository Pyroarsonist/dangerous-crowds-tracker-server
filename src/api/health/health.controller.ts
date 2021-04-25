import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthRequestDto, HealthResponseDto } from 'api/health/dtos';
import { GetUser } from 'common/decorators/current-user.decorator';
import { AuthGuard } from 'common/guards/auth.guard';

@Controller('health')
@UseGuards(AuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  public getHealth(@GetUser('id') userId: number): Promise<HealthResponseDto> {
    return this.healthService.getHealth(userId);
  }

  @Post()
  public async updateHealth(
    @GetUser('id') userId: number,
    @Body() { status }: HealthRequestDto,
  ): Promise<void> {
    await this.healthService.updateHealth(userId, status);
  }
}
