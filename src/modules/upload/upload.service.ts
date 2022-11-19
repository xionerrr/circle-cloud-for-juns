import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { File } from 'src/entities'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    console.log(file, 'upload')
    return
  }

  async downloadFile(fileId: number) {
    console.log(fileId, 'download')
    return
  }
}
