import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { CreateMyTaskDto } from './dtos'
import { InfoService } from './info.service'

import { Task, User } from 'src/entities'
import { I_GetData } from 'src/models'

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('info')
@ApiTags('Info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getMyInfo(@Req() req: Request): Promise<I_GetData<User>> {
    const user = req.user
    return this.infoService.getMyInfo(Number(user['sub']))
  }

  @Get('me/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User tasks fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getMyTasks(@Req() req: Request): Promise<I_GetData<Task[]>> {
    const user = req.user
    return this.infoService.getMyTasks(Number(user['sub']))
  }

  @Post('me/tasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User task created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createMyTask(
    @Req() req: Request,
    @Body() body: CreateMyTaskDto,
  ): Promise<I_GetData<{ task: Omit<Task, 'updatedAt' | 'creator'> }>> {
    const user = req.user
    return this.infoService.createMyTask(Number(user['sub']), body)
  }
}
