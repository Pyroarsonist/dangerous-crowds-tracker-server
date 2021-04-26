import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'common/database/database.module';
import { CoronavirusService } from 'common/coronavirus/coronavirus.service';

@Module({
  imports: [ConfigModule, DatabaseModule, HttpModule],
  exports: [DatabaseModule, CoronavirusService],
  providers: [CoronavirusService],
})
export class CommonModule {}
