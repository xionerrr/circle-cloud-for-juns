import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FileUploadDto {
  @ApiProperty()
  fileName: string

  @ApiProperty()
  @IsString()
  url: string

  @ApiProperty()
  @IsString()
  mimetype: string
}
