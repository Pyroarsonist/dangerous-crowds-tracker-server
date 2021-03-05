import { SequelizeModule } from '@nestjs/sequelize';

import * as models from './models';

export const databaseProviders = [
  SequelizeModule.forFeature(Object.values(models)),
];
