import { FileInterceptor } from '@nestjs/platform-express'
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { v4 } from 'uuid'

import { I_FilesInterceptor } from './models'

export function FilesInterceptor(
  options: I_FilesInterceptor,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor(readonly configService: ConfigService) {
      const filesDestination = configService.get('FILES_DIRECTORY')

      const destination = `${filesDestination}${options.path}`

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, callback) => {
            const filename = v4() + '-' + file.originalname
            callback(null, filename)
          },
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      }

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))()
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }
  return mixin(Interceptor)
}
