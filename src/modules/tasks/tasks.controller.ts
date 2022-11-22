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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { CreateTaskDto, UpdateTaskDto } from './dtos'
import { TasksService } from './tasks.service'
import { T_Task } from './models'

import { E_Roles, I_GetData } from 'src/models'
import { RolesGuard } from 'src/guards'

@UseGuards(AuthGuard('jwt'), RolesGuard([E_Roles.admin]))
@ApiBearerAuth()
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

  @Post(':userId/tasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  createTask(
    @Param('userId') userId: string,
    @Body() body: CreateTaskDto,
  ): Promise<I_GetData<{ task: Omit<T_Task, 'updatedAt' | 'creator'> }>> {
    return this.tasksService.createTask(Number(userId), body)
  }

  @Delete(':userId/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteTask(
    @Param('userId') userId: string,
    @Param('taskId') taskId: string,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    return this.tasksService.deleteTask(Number(userId), Number(taskId))
  }
}
