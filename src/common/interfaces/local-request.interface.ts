import { Request } from 'express';
import { UserModel } from 'common/database/models';

export interface LocalRequestInterface extends Request {
  locals: {
    user?: UserModel;
  };
}
