import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  mixin,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { E_Roles } from 'src/models'
import { UsersService } from 'src/modules/users/users.service'

export function RolesGuard(roles: E_Roles[]) {
  class RolesGuardMixin implements CanActivate {
    constructor(
      public reflector: Reflector,
      @Inject(UsersService) public usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        if (!roles) return true

        const req: Request = await context.switchToHttp().getRequest()

        const user = await this.usersService.findOneBy(Number(req.user['sub']))

        return roles.includes(user.role)
      } catch {
        throw new HttpException(
          {
            message: 'Access forbidden',
          },
          HttpStatus.FORBIDDEN,
        )
      }
    }
  }

  return mixin(RolesGuardMixin)
}
