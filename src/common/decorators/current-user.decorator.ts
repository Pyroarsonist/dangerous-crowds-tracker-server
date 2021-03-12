import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LocalRequestInterface } from 'common/interfaces/local-request.interface';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const {
      locals,
    } = context.switchToHttp().getRequest<LocalRequestInterface>();
    const { user } = locals;

    return data ? user[data] : user;
  },
);
