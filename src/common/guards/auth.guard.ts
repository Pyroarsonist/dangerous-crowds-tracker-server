import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'common/database/models';
import { LocalRequestInterface } from 'common/interfaces/local-request.interface';
import { UserInterface } from 'common/database/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<LocalRequestInterface>();
    const authHeader = request.headers.authorization;
    const token = (authHeader || '').replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userModel.findOne({ where: { token } });
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    request.locals.user = user.toJSON() as UserInterface;

    return true;
  }
}
