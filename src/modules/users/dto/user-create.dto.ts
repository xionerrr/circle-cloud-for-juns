import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserCreateDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ default: 'name' })
  @IsOptional()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string

  @ApiProperty({ default: '123' })
  @IsString()
  @IsNotEmpty()
  password: string
}
