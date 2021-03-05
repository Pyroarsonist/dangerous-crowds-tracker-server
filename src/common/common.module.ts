import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'common/database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
  exports: [DatabaseModule],
})
export class CommonModule {}
