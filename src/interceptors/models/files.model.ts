import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

export interface I_FilesInterceptor {
  fieldName: string
  path?: string
  fileFilter?: MulterOptions['fileFilter']
  limits?: MulterOptions['limits']
}
