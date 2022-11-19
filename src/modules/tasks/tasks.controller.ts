import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { UpdateTaskDto } from './dtos'
import { TasksService } from './tasks.service'
import { T_Task } from './models'

import { I_GetData } from 'src/models'

@Controller('users')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':userId/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getTasks(
    @Param('userId') userId: string,
  ): Promise<I_GetData<{ tasks: T_Task[]; count: number }>> {
    return this.tasksService.getTasks(Number(userId))
  }

  @Get(':userId/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task fetched successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  getTask(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
  ): Promise<I_GetData<{ task: T_Task }>> {
    return this.tasksService.getTask(Number(userId), Number(taskId))
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put(':userId/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateTask(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
    @Body() body: UpdateTaskDto,
  ): Promise<I_GetData<{ task: T_Task }>> {
    return this.tasksService.updateTask(Number(userId), Number(taskId), body)
  }
}
