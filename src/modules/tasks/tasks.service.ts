import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTaskDto, UpdateTaskDto } from './dtos'
import { T_Task } from './models'

import { I_GetData } from 'src/models'
import { Task } from 'src/entities'

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
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async getTask(
    userId: number,
    taskId: number,
  ): Promise<I_GetData<{ task: T_Task }>> {
    try {
      const task = await this.repository.findOne({
        where: {
          id: taskId,
          creator: {
            id: userId,
          },
        },
      })

      if (!task) throw new NotFoundException(`Task with id ${taskId} not found`)

      return {
        message: 'Successfully fetched task',
        data: {
          task,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async updateTask(
    userId: number,
    taskId: number,
    body: UpdateTaskDto,
  ): Promise<I_GetData<{ task: T_Task }>> {
    try {
      const taskExists = await this.repository.findOne({
        where: {
          id: taskId,
          creator: {
            id: userId,
          },
        },
      })

      if (!taskExists)
        throw new NotFoundException(`Task with id ${taskId} not found`)

      const task = await this.repository.save({
        ...taskExists,
        ...body,
      })

      return {
        message: 'Successfully updated task',
        data: {
          task,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async createTask(
    userId: number,
    body: CreateTaskDto,
  ): Promise<I_GetData<{ task: Omit<T_Task, 'updatedAt' | 'creator'> }>> {
    try {
      const newTask = await this.repository.create({
        creator: {
          id: userId,
        },
        ...body,
      })

      const task = await this.repository.save(newTask)

      return {
        message: 'Successfully created task',
        data: {
          task: {
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            createdAt: task.createdAt,
          },
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async deleteTask(
    userId: number,
    taskId: number,
  ): Promise<Omit<I_GetData<unknown>, 'data'>> {
    try {
      const task = await this.repository.findOne({
        where: {
          id: taskId,
          creator: {
            id: userId,
          },
        },
      })

      if (!task)
        throw new NotFoundException(
          `Task with id: ${taskId} in user: ${userId} not found`,
        )

      await this.repository.delete({
        id: taskId,
        creator: {
          id: userId,
        },
      })

      return {
        message: `Successfully deleted task with id: ${taskId}`,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }
}
