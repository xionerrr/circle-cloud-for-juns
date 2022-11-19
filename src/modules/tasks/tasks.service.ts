import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { T_Task } from './models'

import { Task } from 'src/entities/task.entity'
import { E_ServerStatus, I_GetData } from 'src/models/app.model'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async getTasks(
    userId: number,
  ): Promise<I_GetData<{ tasks: T_Task[]; count: number }>> {
    try {
      const tasks = await this.repository.find({
        where: {
          creator: {
            id: userId,
          },
        },
      })

      return {
        message: 'Successfully fetched tasks',
        data: {
          tasks,
          count: tasks.length,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }
}
