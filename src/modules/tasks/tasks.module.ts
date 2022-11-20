import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

import { UsersService } from '../users/users.service'

import { Task, User } from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TypeOrmModule.forFeature([User])],
  controllers: [TasksController],
  providers: [TasksService, UsersService],
})
export class TasksModule {}
