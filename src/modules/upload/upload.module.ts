import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

import { File } from 'src/entities'

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
