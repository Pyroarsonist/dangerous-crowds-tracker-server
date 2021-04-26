import { Module } from '@nestjs/common';
import { HealthzController } from './healthz.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { LocationsService } from 'api/locations/locations.service';
import { LocationsController } from 'api/locations/locations.controller';
import { ProfileController } from 'api/profile/profile.controller';
import { ProfileService } from 'api/profile/profile.service';
import { HealthController } from 'api/health/health.controller';
import { HealthService } from 'api/health/health.service';
import { StatsController } from 'api/stats/stats.controller';
import { StatsService } from 'api/stats/stats.service';
import { CommonModule } from 'common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [
    HealthzController,
    AuthController,
    LocationsController,
    ProfileController,
    HealthController,
    StatsController,
  ],
  providers: [
    AuthService,
    LocationsService,
    ProfileService,
    HealthService,
    StatsService,
  ],
})
export class ApiModule {}
