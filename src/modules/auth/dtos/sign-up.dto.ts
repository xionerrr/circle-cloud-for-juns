import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SignUpDto {
  @ApiProperty({ default: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ default: 'first_name' })
  @IsOptional()
  @IsString()
  firstName: string

  @ApiProperty({ default: 'last_name' })
  @IsOptional()
  @IsString()
  lastName: string

  @ApiProperty({ default: '123' })
  @IsString()
  @IsNotEmpty()
  password: string
}
