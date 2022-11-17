import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { UserCreateDto, UserUpdateDto } from './dto'
import { T_User } from './models'

import { User } from 'src/entities/user.entity'
import { E_ServerStatus, I_GetData } from 'src/models/app.model'
import { typeReturn } from 'src/utils'
import { T_UserFindParam, T_UserFindType } from 'src/models/user.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async getUsers(): Promise<I_GetData<{ users: T_User[]; count: number }>> {
    try {
      const usersCount = await this.repository.count()
      const users = await this.repository.find({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
        },
      })

      return {
        message: 'Successfully fetched users',
        data: {
          users,
          count: usersCount,
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async getUser(
    userId: number,
  ): Promise<I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt'> }>> {
    await this.checkNotExists('id', userId)

    try {
      const user = await this.repository.findOneBy({
        id: userId,
      })

      return {
        message: 'Successfully fetched user',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
          },
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async createUser(
    body: UserCreateDto,
  ): Promise<I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt'> }>> {
    await this.checkExists('email', body.email)

    const { password, ...data } = body

    const hashedPassword = await argon2.hash(password)

    try {
      const user = await this.repository.save({
        password: hashedPassword,
        ...data,
      })

      return {
        message: 'Successfully created user',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
          },
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async updateUser(
    userId: number,
    body: UserUpdateDto,
  ): Promise<I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt'> }>> {
    await this.checkNotExists('id', userId)

    try {
      const prevData = await this.repository.findOneBy({
        id: userId,
      })

      const newData = await this.repository.save({
        ...prevData,
        ...body,
      })

      return {
        message: 'Successfully updated user',
        data: {
          user: {
            id: newData.id,
            email: newData.email,
            firstName: newData.firstName,
            lastName: newData.lastName,
            isActive: newData.isActive,
          },
        },
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async deleteUser(userId: number): Promise<Omit<I_GetData<unknown>, 'data'>> {
    await this.checkNotExists('id', userId)

    try {
      await this.repository.delete(userId)

      return {
        message: `Successfully deleted user with id: ${userId}`,
        timestamp: new Date(),
      }
    } catch (error) {
      throw new ForbiddenException({
        message: {
          text: error.detail,
          status: E_ServerStatus.FORBIDDEN,
        },
      })
    }
  }

  async checkNotExists(type: T_UserFindType, param: T_UserFindParam) {
    try {
      const user = await this.repository.findOneBy({
        [type]: param,
      })

      if (!user)
        throw new NotFoundException(`User with ${type}: ${param} not found`)
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }

  async checkExists(type: T_UserFindType, param: T_UserFindParam) {
    try {
      const user = await this.repository.findOneBy({
        [type]: param,
      })

      if (user)
        throw new ForbiddenException(
          `User with ${type}: ${param} already exists`,
        )
    } catch (error) {
      throw new ForbiddenException(error.response)
    }
  }
}
