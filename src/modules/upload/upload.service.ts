import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
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
    try {
      const file = this.repository.create(body)

      await this.repository.save(file)

      return {
        message: 'Successfully uploaded file',
        data: file,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async downloadFile(fileId: number): Promise<I_GetData<File>> {
    try {
      const file = await this.repository.findOne({
        where: {
          id: fileId,
        },
      })

      if (!file) throw new NotFoundException(`File with id ${fileId} not found`)

      return {
        message: 'Successfully fetched file',
        data: file,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async updateFile(fieldId: number): Promise<I_GetData<File>> {
    try {
      return {
        message: 'Successfully updated file',
        data: null,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async deleteFile(fileId: number): Promise<Omit<I_GetData<unknown>, 'data'>> {
    try {
      const file = await this.repository.findOneBy({
        id: fileId,
      })

      if (!file) throw new NotFoundException(`File with id ${fileId} not found`)

      await this.repository.delete({
        id: fileId,
      })

      return {
        message: `Successfully deleted file with id: ${fileId}`,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }

  async getFileById(fileId: number) {
    try {
      const file = await this.repository.findOne({
        where: {
          id: fileId,
        },
      })

      if (!file) throw new NotFoundException(`File with id ${fileId} not found`)

      return file
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.message,
          status: error.status,
        },
      })
    }
  }
}
