import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { E_TaskPriority } from 'src/models'

export class CreateTaskDto {
  @ApiProperty({ example: 'Title' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ example: 'Description' })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({ example: E_TaskPriority.firstly, enum: E_TaskPriority })
  @IsOptional()
  @IsEnum(E_TaskPriority)
  priority: E_TaskPriority
}
