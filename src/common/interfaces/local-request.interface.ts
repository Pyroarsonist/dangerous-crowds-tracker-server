import { Request } from 'express';
import { UserInterface } from 'common/database/interfaces';

export interface LocalRequestInterface extends Request {
  locals: {
    user?: UserInterface;
  };
}
