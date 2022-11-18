import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { SignInDto, SignUpDto } from './dto'
import { I_Auth } from './models'

import { I_GetData } from 'src/models/app.model'

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
}
