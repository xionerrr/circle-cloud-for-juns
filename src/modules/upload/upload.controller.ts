import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { UploadService } from './upload.service'

import { File } from 'src/entities'
import { FilesInterceptor } from 'src/interceptors'
import { E_Roles, I_GetData } from 'src/models'
import { RolesGuard } from 'src/guards'

@UseGuards(AuthGuard('jwt'), RolesGuard([E_Roles.admin]))
@ApiBearerAuth()
@Controller('upload')
@ApiTags('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('files')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'File uploaded',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  @UseInterceptors(
    FilesInterceptor({
      fieldName: 'file',
      path: '',
      fileFilter: (_, file, callback) => {
        callback(null, true)
      },
      limits: {
        fileSize: 2048 ** 2, // 4MB
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<I_GetData<File>> {
    if (!file) throw new BadRequestException('It should be a file')

    return this.uploadService.uploadFile({
      url: `/uploads/${file.filename}`,
      fileName: file.originalname,
      mimetype: file.mimetype,
    })
  }

  @Get('files/:fileId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File uploaded',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  downloadFile(@Param('fileId') fileId: string) {
    return this.uploadService.downloadFile(Number(fileId))
  }

  @Patch('files/:fileId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File updated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  updateFile(@Param('fileId') fileId: string) {
    return this.uploadService.updateFile(Number(fileId))
  }

  @Delete('files/:fileId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'File deleted',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
  })
  deleteFile(@Param('fileId') fileId: string) {
    return this.uploadService.deleteFile(Number(fileId))
  }
}
