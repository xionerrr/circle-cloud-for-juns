import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { I_GetData } from 'src/models'

@UseGuards(AuthGuard('jwt'))
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
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Incorrect file type'), false)
        }
        callback(null, true)
      },
      limits: {
        fileSize: 2048 ** 2,
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<I_GetData<File>> {
    return this.uploadService.uploadFile({
      url: '/uploads/' + file.filename,
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
