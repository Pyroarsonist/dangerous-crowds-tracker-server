import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'api/api.module';
import { CommonModule } from 'common/common.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CommonModule,
    ApiModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
