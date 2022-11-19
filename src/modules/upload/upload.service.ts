import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { FileUploadDto } from './dtos'

import { File } from 'src/entities'
import { I_GetData } from 'src/models'

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(File)
    private repository: Repository<File>,
  ) {}

  async uploadFile(body: FileUploadDto): Promise<I_GetData<File>> {
    const file = this.repository.create(body)
    await this.repository.save(file)
    return {
      message: 'Successfully uploaded file',
      data: file,
      timestamp: new Date(),
    }
  }

  async downloadFile(fileId: number): Promise<I_GetData<File>> {
    const file = await this.repository.findOne({
      where: {
        id: fileId,
      },
    })
    console.log(fileId, 'download')
    return {
      message: 'Successfully fetched file',
      data: file,
      timestamp: new Date(),
    }
  }

  async deleteFile(fileId: number): Promise<Omit<I_GetData<unknown>, 'data'>> {
    await this.repository.delete({
      id: fileId,
    })
    return {
      message: `Successfully deleted file with id: ${fileId}`,
      timestamp: new Date(),
    }
  }
}
