import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UserUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string
}
