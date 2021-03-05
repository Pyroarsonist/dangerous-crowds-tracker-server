import { Module } from '@nestjs/common';
import { DatabaseModule } from 'common/database/database.module';
import { HealthzController } from './healthz.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthzController, AuthController],
  providers: [AuthService],
})
export class ApiModule {}
