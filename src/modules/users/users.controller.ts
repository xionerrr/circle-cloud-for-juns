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
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { UserCreateDto, UserUpdateDto } from './dtos'
import { UsersService } from './users.service'
import { T_User } from './models'

import { E_Roles, I_GetData } from 'src/models'
import { RolesGuard } from 'src/guards'

@UseGuards(AuthGuard('jwt'), RolesGuard([E_Roles.admin]))
@ApiBearerAuth()
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
  getUsers(): Promise<
    I_GetData<{ users: T_User[]; count: number; total: number }>
  > {
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
  ): Promise<I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt'> }>> {
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
  ): Promise<
    I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt' | 'tasks'> }>
  > {
    return this.usersService.createUser(body)
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateUser(
    @Param('userId') userId: string,
    @Body() body: UserUpdateDto,
  ): Promise<
    I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt' | 'tasks'> }>
  > {
    return this.usersService.updateUser(Number(userId), body)
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteUser(
    @Param('userId') userId: string,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    return this.usersService.deleteUser(Number(userId))
  }
}
