import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { parse } from 'pg-connection-string';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseProviders } from './database.providers';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        const { host, user: username, database, port, password } = parse(url);

        return {
          type: 'postgres',
          dialect: 'postgres',
          url,
          autoLoadModels: true,
          synchronize: true,
          username,
          password,
          database,
          host,
          port: +port,
          define: {
            freezeTableName: true,
          },
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    ...databaseProviders,
  ],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
