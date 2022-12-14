import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InfoController } from './info.controller'
import { InfoService } from './info.service'

import { Task, User } from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TypeOrmModule.forFeature([User])],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
