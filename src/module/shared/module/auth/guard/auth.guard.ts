import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from '@sharedModules/auth/auth.module'
import { Request } from 'express'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clsService: ClsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = await this.getRequest(context)
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret
      })
      this.clsService.set('userId', payload.sub)
      this.clsService.set('userToken', token)
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }
  private async getRequest(context: ExecutionContext): Promise<Request> {
    try {
      if (context.getType<ContextType | 'graphql'>() === 'graphql') {
        const ctx = GqlExecutionContext.create(context)
        const req = ctx.getContext().req
        return req as Request
      }
      const req = context.switchToHttp().getRequest<Request>()

      return req
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.get('Authorization')?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
