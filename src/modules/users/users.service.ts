import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { UserCreateDto, UserUpdateDto } from './dtos'
import { T_User } from './models'

import { User } from 'src/entities'
import { I_GetData, T_UserFindParam, T_UserFindType } from 'src/models'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async getUsers(): Promise<
    I_GetData<{ users: T_User[]; count: number; total: number }>
  > {
    try {
      const totalUsers = await this.repository.count()
      const users = await this.repository
        .createQueryBuilder('user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('user.firstName')
        .addSelect('user.lastName')
        .addSelect('user.active')
        .loadRelationCountAndMap('user.tasksCount', 'user.tasks')
        .getMany()

      return {
        message: 'Successfully fetched users',
        data: {
          users,
          count: users.length,
          total: totalUsers,
        },
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

  async getUser(
    userId: number,
  ): Promise<I_GetData<{ user: Omit<T_User, 'createdAt' | 'updatedAt'> }>> {
    await this.checkNotExists('id', userId)

    try {
      const user = await this.repository.findOne({
        where: {
          id: userId,
        },
        relations: ['tasks'],
      })

      return {
        message: 'Successfully fetched user',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            active: user.active,
            tasks: user.tasks,
          },
        },
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
            active: user.active,
            tasks: user.tasks,
          },
        },
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
            active: newData.active,
            tasks: newData.tasks,
          },
        },
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
          text: error.message,
          status: error.status,
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
