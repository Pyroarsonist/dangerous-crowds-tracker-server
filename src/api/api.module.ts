import { Module } from '@nestjs/common';
import { DatabaseModule } from 'common/database/database.module';
import { HealthzController } from './healthz.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { LocationsService } from 'api/locations/locations.service';
import { LocationsController } from 'api/locations/locations.controller';
import { ProfileController } from 'api/profile/profile.controller';
import { ProfileService } from 'api/profile/profile.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    HealthzController,
    AuthController,
    LocationsController,
    ProfileController,
  ],
  providers: [AuthService, LocationsService, ProfileService],
})
export class ApiModule {}
