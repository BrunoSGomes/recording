import { jwtConstants } from '@identityModule/core/service/authentication.service'
import { UserManagementService } from '@identityModule/core/service/user-management.service'
import { User } from '@identityModule/persistence/entity/user.entity'
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

export interface AuthenticatedRequest extends Request {
  user: User
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userManagementService: UserManagementService
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

      const user = await this.userManagementService.getUserById(payload.sub)
      if (!user) {
        throw new UnauthorizedException()
      }
      request.user = user
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }
  private async getRequest(
    context: ExecutionContext
  ): Promise<AuthenticatedRequest> {
    try {
      if (context.getType<ContextType | 'graphql'>() === 'graphql') {
        const ctx = GqlExecutionContext.create(context)
        const req = ctx.getContext().req
        return req as AuthenticatedRequest
      }
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>()

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
