import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'

import { UsersService } from './users.service'
import { UserCreateDto } from './dto'
import { T_User } from './models'

import { I_GetData } from 'src/models/app.model'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getUsers(): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    return this.usersService.getUsers()
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getUser(
    @Param('userId') userId: string,
  ): Promise<I_GetData<{ user: T_User }>> {
    return this.usersService.getUser(Number(userId))
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createUser(
    @Body() body: UserCreateDto,
  ): Promise<I_GetData<{ user: T_User }>> {
    return this.usersService.createUser(body)
  }
}
