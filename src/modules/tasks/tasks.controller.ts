import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { T_Task } from './models'
import { TasksService } from './tasks.service'

import { I_GetData } from 'src/models/app.model'

@Controller('tasks')
@ApiTags('Tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':userId')
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
}
