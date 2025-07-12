import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers?.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token de autorização necessário');
    }

    const hash = authorization.replace('Bearer ', '');
    const adminHash = this.configService.get<string>('ADMIN_HASH');

    if (hash !== adminHash) {
      throw new UnauthorizedException('Token de autorização inválido');
    }

    return true;
  }
}
