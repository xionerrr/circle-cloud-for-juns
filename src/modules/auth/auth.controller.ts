import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { RefreshDto, SignInDto, SignUpDto } from './dto'
import { I_Auth, T_AuthRefresh } from './models'

import { I_GetData } from 'src/models/app.model'
import { Request } from 'express'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Signed up',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signUp(@Body() body: SignUpDto): Promise<I_GetData<I_Auth>> {
    return this.authService.signUp(body)
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signed in',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  signIn(@Body() body: SignInDto): Promise<I_GetData<I_Auth>> {
    return this.authService.signIn(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  refreshTokens(
    @Req() req: Request,
    @Body() body: RefreshDto,
  ): Promise<I_GetData<T_AuthRefresh>> {
    const user = req.user
    return this.authService.refreshTokens(Number(user['sub']), body)
  }
}
