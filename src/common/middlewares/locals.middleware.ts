import { Response } from 'express';
import { LocalRequestInterface } from 'common/interfaces/local-request.interface';

export function localsMiddleware(
  req: LocalRequestInterface,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  req.locals = {};
  return next();
}
