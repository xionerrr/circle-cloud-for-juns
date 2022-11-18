import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshDto {
  @ApiProperty({ default: 'Token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
