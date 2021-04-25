import { Module } from '@nestjs/common';
import { DatabaseModule } from 'common/database/database.module';
import { HealthzController } from './healthz.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { LocationsService } from 'api/locations/locations.service';
import { LocationsController } from 'api/locations/locations.controller';
import { ProfileController } from 'api/profile/profile.controller';
import { ProfileService } from 'api/profile/profile.service';
import { HealthController } from 'api/health/health.controller';
import { HealthService } from 'api/health/health.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    HealthzController,
    AuthController,
    LocationsController,
    ProfileController,
    HealthController,
  ],
  providers: [AuthService, LocationsService, ProfileService, HealthService],
})
export class ApiModule {}
