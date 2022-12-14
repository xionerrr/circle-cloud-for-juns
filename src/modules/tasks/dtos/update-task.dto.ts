import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { E_TaskPriority } from 'src/models/task.model'

export class UpdateTaskDto {
  @ApiProperty({ example: 'New title' })
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ example: 'New description' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ example: E_TaskPriority.firstly, enum: E_TaskPriority })
  @IsOptional()
  @IsEnum(E_TaskPriority)
  priority: E_TaskPriority
}
