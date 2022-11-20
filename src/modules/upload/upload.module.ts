import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

import { UsersService } from '../users/users.service'

import { File, User } from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([File]), TypeOrmModule.forFeature([User])],
  controllers: [UploadController],
  providers: [UploadService, UsersService],
})
export class UploadModule {}
